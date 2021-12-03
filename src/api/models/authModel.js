import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();

import { INVAILD_ACCESSTOKEN, INVAILD_REFRESHTOKEN, LOGIN_ERROR } from '../helpers/constants/Errors';
import { redisClient } from '../helpers/constants/redisClient';
import userModel from './userModel';
import sendEmail from '../helpers/constants/sendEmail';

const optsAccess = {
    expiresIn: process.env.EXPIRES_ACCESSTOKEN
};
const optsVerify = {
    expiresIn: process.env.EXPIRES_VERIFYTOKEN
};
const optsRefresh = {
    expiresIn: process.env.EXPIRES_REFRESHTOKEN
};

export default {
    login: async (req, res) => {
        try{
            const user = await userModel.findByEmail(req.body.email);
            if (user === null) {
                return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR)
            }
            
            if (bcrypt.compareSync(req.body.password, user.password) === false) {
                return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR)
            }
            const payloadAccessToken = {
                userId: user.id
            };
            const payloadRefreshToken = {
                userId: user.id,
                userEmail: user.email
            };
            const accessToken = jwt.sign(payloadAccessToken, process.env.SERET_KEY, optsAccess);
            const refreshToken = jwt.sign(payloadRefreshToken, process.env.SERET_KEY, optsRefresh);
            
            // redis save refresh_token
            redisClient.set(userId, JSON.stringify({
                refresh_token: refresh_token,
            }),
            redisClient.print
            );

            res.json({
                accessToken,
                refreshToken
        });
        }catch (err) {
            // console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    refresh: async (req, res) => {
        const { accessToken, refreshToken } = req.body;
        const opts = {
            ignoreExpiration: true
        };

        var _userId = -1

        try {
            const { userId } = jwt.verify(accessToken, process.env.SERET_KEY, opts);
            _userId = userId;
        } catch (err) {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        const value = await redisClient.get(_userId);
        console.log("redis:",value);
        
        if (value.refresh !== refreshToken)
        {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        try {
            const { userId, userEmail } = jwt.verify(refreshToken, process.env.SERET_KEY, opts);
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRES_REFRESHTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        // create new access token
        const payload = { userId };
        const new_accessToken = jwt.sign(payload, process.env.SERET_KEY, optsAccess);
        return res.json({
            accessToken: new_accessToken,
            refreshToken: refreshToken
        });
    },
    logout: async (req, res) =>{
        const { accessToken, refreshToken } = req.body;
        const opts = {
            ignoreExpiration: true
        };
        try {
            const { userId } = jwt.verify(accessToken, process.env.SERET_KEY, opts);
            redis.del(userId);
            return res.status(httpStatus.NO_CONTENT).send()
        } catch (err) {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }
    },
    register: async(req, res) =>{
        const user = await userModel.add(req.body)
        
        const payloadVerifyToken = {
            userId: user.id
        };

        const verifyToken = jwt.sign(payloadVerifyToken, process.env.SERET_KEY, optsVerify);
        sendEmail(req.body.email,accessToken)
    },
    verify: async(req, res) =>{
        const verifyToken = req.params.token
        try {
            const { userId } = jwt.verify(verifyToken, process.env.SERET_KEY, optsVerify);
            await userModel.patch(userId, {
                active: true
            });
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRES_VERIFYTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN)
        }
    },
    resetByEmail: async(req, res) =>{
        const email = req.params.email
        const user = await userModel.findByEmail(req.body.email);
        
        const payloadVerifyToken = {
            userId: user.id
        };

        const verifyToken = jwt.sign(payloadVerifyToken, process.env.SERET_KEY, optsVerify);
        sendEmail(email,verifyToken)
        return res.status(httpStatus.NO_CONTENT).send()
    },
    resetPass: async(req,res) =>{
        const {password, token} = req.body
        try {
            const { userId } = jwt.verify(token, process.env.SERET_KEY, optsVerify);
            await userModel.patch(userId, {
                password: password
            });
            return res.status(httpStatus.NO_CONTENT).send()
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRES_VERIFYTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN)
        }
    }
};