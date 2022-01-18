import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { EXPIRED_ACCESSTOKEN, INVAILD_ACCESSTOKEN, NOTFOUND_ACCESSTOKEN } from '../helpers/constants/Errors';
dotenv.config();
export default function auth(req, res, next) {
    var accessToken =  req.headers['authorization'];
    if (accessToken && accessToken.startsWith('Bearer ')){
        accessToken = accessToken.slice(7, accessToken.length);
    }
    if (accessToken) {
        try {
            var result = jwt.verify(accessToken, process.env.SECRET_KEY);
            req.accessTokenPayload = result;
            return next();
        } catch (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError')
                return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_ACCESSTOKEN);
            return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_ACCESSTOKEN);
        }
    }
    else {
        return res.status(httpStatus.UNAUTHORIZED).send(NOTFOUND_ACCESSTOKEN);
    }
}