import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import dotenv from 'dotenv'
import { INVAILD_ACCESSTOKEN, NOTFOUND_ACCESSTOKEN } from '../helpers/constants/Errors';
dotenv.config()
export default function auth(req, res, next) {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      var result = jwt.verify(accessToken, process.env.SERET_KEY)
      req.accessTokenPayload = result;
      return next();
    } catch (err) {
      console.log(err);
      return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_ACCESSTOKEN);
    }
  }
  else {
    return res.status(httpStatus.UNAUTHORIZED).send(NOTFOUND_ACCESSTOKEN);
  }
}