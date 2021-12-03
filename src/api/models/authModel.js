import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
dotenv.config();

import { DB_QUERY_ERROR, EXPIRED_ACCESSTOKEN, EXPIRED_REFRESHTOKEN, EXPIRED_VERIFYTOKEN, INVAILD_ACCESSTOKEN, INVAILD_REFRESHTOKEN, INVAILD_VERIFYTOKEN, LOGIN_ERROR, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { redisClient } from '../helpers/constants/redisClient';
import userModel from './userModel';
import sendEmail from '../helpers/constants/sendEmail';

const optsAccess = {
    expiresIn: process.env.EXPIRED_ACCESSTOKEN
};
const optsVerify = {
    expiresIn: process.env.EXPIRED_VERIFYTOKEN
};
const optsRefresh = {
    expiresIn: process.env.EXPIRED_REFRESHTOKEN
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
            await redisClient.connect()
            await redisClient.set(''+user.id, JSON.stringify({ // redis key must be string
                refreshToken: refreshToken,
            }),
            redisClient.print
            );

            res.json({
                accessToken,
                refreshToken
        });
        }catch (err) {
            //console.log(err);
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

        //connect redis and get value of userID
        await redisClient.connect()
        var value = await redisClient.get(""+_userId); // redis key must be string
        value = JSON.parse(value);
        
        if (value.refreshToken !== refreshToken)
        {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        try {
            const { userId, userEmail } = jwt.verify(refreshToken, process.env.SERET_KEY, opts);
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_REFRESHTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        // create new access token
        const payload = { _userId };
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
            redis.del(""+userId); // redis key must be string
            return res.status(httpStatus.NO_CONTENT).send()
        } catch (err) {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }
    },
    register: async(req, res) =>{
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var user = null
        try {
            user = await userModel.add(req.body)
        } catch (error) {
            return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR)
        }

        const payloadVerifyToken = {
            userId: user[0]
        };

        const verifyToken = jwt.sign(payloadVerifyToken, process.env.SERET_KEY, optsVerify);
        sendEmail(req.body.email,verifyToken)
        return res.status(httpStatus.NO_CONTENT).send()
    },
    verify: async(req, res) =>{
        const verifyToken = req.query.token
        try {
            const { userId } = jwt.verify(verifyToken, process.env.SERET_KEY);
            await userModel.patch(userId, {
                active: true
            });
            return res.status(httpStatus.NO_CONTENT).send()
        } catch (err) {
            if (err.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN)
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