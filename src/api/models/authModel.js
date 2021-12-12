import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
dotenv.config();

import { DB_QUERY_ERROR, EXPIRED_REFRESHTOKEN, EXPIRED_VERIFYTOKEN, INVAILD_REFRESHTOKEN, INVAILD_VERIFYTOKEN, LOGIN_ERROR, NOTFOUND_REDIS, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { setRedis,getRedis, delRedis, setExRedis } from '../helpers/constants/redisClient';
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
            //find user by email
            const user = await userModel.findByEmail(req.body.email);
            if (user === null) {
                return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR)
            }
            
            // check password
            if (bcrypt.compareSync(req.body.password, user.password) === false) {
                return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR)
            }

            // create access token and refresh token
            const payloadAccessToken = {
                userId: user.id,
                role: user.role
            };
            const payloadRefreshToken = {
                userId: user.id,
                role: user.role,
                userEmail: user.email
            };
            const accessToken = jwt.sign(payloadAccessToken, process.env.SERET_KEY, optsAccess);
            const refreshToken = jwt.sign(payloadRefreshToken, process.env.SERET_KEY, optsRefresh);
            
            // set value from redis
            await setExRedis(user.id,process.env.REDIS_EXPIRED_SECOND,{ 
                refreshToken: refreshToken,
            })

            // return access token and refresh token
            return res.json({
                accessToken,
                refreshToken
            });
        }catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    refresh: async (req, res) => {
        const { accessToken, refreshToken } = req.body;
        const opts = {
            ignoreExpiration: true
        };

        var _userId = -1
        var _role = -1

        // verify token and get user id
        try {
            const { userId,role } = jwt.verify(accessToken, process.env.SERET_KEY, opts);
            _userId = userId;
            _role = role
        } catch (err) {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        // get value from redis
        var value = null;
        try{
            value = await getRedis(_userId);
        }catch(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
        if (!value)
        {
            return res.status(httpStatus.UNAUTHORIZED).send(NOTFOUND_REDIS);
        }

        // check refresh token and redis refresh token
        if (value.refreshToken !== refreshToken)
        {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        // check expired and valid of refresh token
        try {
            const { userId, role, userEmail } = jwt.verify(refreshToken, process.env.SERET_KEY, opts);
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_REFRESHTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }

        // create new access token
        const payload = { _userId,_role };
        const new_accessToken = jwt.sign(payload, process.env.SERET_KEY, optsAccess);
        
        // return new access token and refresh token
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
            const { userId,role } = jwt.verify(accessToken, process.env.SERET_KEY, opts);
            
            // delete data of user have userId in redis
            await delRedis(userId);

            return res.status(httpStatus.NO_CONTENT).send()
        } catch (err) {
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_REFRESHTOKEN)
        }
    },
    register: async(req, res) =>{
        //hash pass
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var user = null

        //add user
        try {
            user = await userModel.add(req.body)
        } catch (error) {
            console.log(error);
            if (error.sqlState === '23000')
                return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR)
        }

        // create access token and refresh token
        const payloadVerifyToken = {
            userId: user[0]
        };

        const verifyToken = jwt.sign(payloadVerifyToken, process.env.SERET_KEY, optsVerify);
        
        // save verifyToken in redis
        try{
            await setExRedis(user[0],process.env.REDIS_EXPIRED_SECOND,{ 
                verifyToken: verifyToken,
            })
        }catch(err){
            console.log(err)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }

        // send email to user
        sendEmail(req.body.email,verifyToken)

        return res.status(httpStatus.NO_CONTENT).send()
    },
    verify: async(req, res) =>{
        const verifyToken = req.query.token

        var _userId = -1
        // check vaild
        try {
            const { userId} = jwt.verify(verifyToken, process.env.SERET_KEY);
            _userId = userId
        } catch (err) {
            if (err.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN)
        }

        // get value and del value from redis
        try{
            // get value
            var value = await getRedis(_userId);
            if (!value)
            {
                return res.status(httpStatus.UNAUTHORIZED).send(NOTFOUND_REDIS);
            }

            // check verifytoken with value in redis
            if (value.verifyToken !== verifyToken){
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN);
            }

            // del value redis
            await delRedis(_userId)
        }catch(err){
            console.log(err)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }

        // update new password
        await userModel.patch(_userId, {
            is_active: true
        });
        return res.status(httpStatus.NO_CONTENT).send()
    },
    resetByEmail: async(req, res) =>{
        const email = req.query.email
        const user = await userModel.findByEmail(email);
        
        // check user exist
        if (user === null) {
            return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR)
        }

        // create verify token
        const payloadVerifyToken = {
            userId: user.user_id
        };

        const verifyToken = jwt.sign(payloadVerifyToken, process.env.SERET_KEY, optsVerify);
        
        // save verifyToken in redis
        try{
            await setExRedis(user.user_id,process.env.REDIS_EXPIRED_SECOND,{ 
                verifyToken: verifyToken,
            })
        }catch(err){
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
        
        // send email to yser
        sendEmail(email,verifyToken)

        return res.status(httpStatus.NO_CONTENT).send()
    },
    resetPass: async(req,res) =>{
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const {password, token} = req.body
        var _userId = -1;

        // get userId and check jwt
        try {
            const { userId } = jwt.verify(token, process.env.SERET_KEY, optsVerify);
            _userId = userId;
        } catch (err) {
            if (error.name === "TokenExpiredError")
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN)
            else
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN)
        }

        // get value and del value from redis
        try{
            // get value
            var value = await getRedis(_userId);
            if (!value)
            {
                return res.status(httpStatus.UNAUTHORIZED).send(NOTFOUND_REDIS);
            }

            // check verifytoken with value in redis
            if (value.verifyToken !== token){
                return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN);
            }
            // del value redis
            await delRedis(_userId)
        }catch(err){
            console.log(err)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }

        await userModel.patch(_userId, {
            password: password
        });

        return res.status(httpStatus.NO_CONTENT).send()
    }
};