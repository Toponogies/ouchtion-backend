import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import redisClient from '../connection/redisClient';
import { EXPIRED_ACCESSTOKEN, INVAILD_ACCESSTOKEN, INVALID_ACCESSTOKEN, MISSING_HEADER } from '../helpers/constants/errors';
dotenv.config();

export default async function auth(req, res, next) {
	let accessToken = req.headers.authorization;
	if (accessToken && accessToken.startsWith('Bearer ')) {
		accessToken = accessToken.slice(7, accessToken.length);
	}
	if (!accessToken) {
		return res.status(httpStatus.UNAUTHORIZED).send(MISSING_HEADER);
	}

	// Verify token
	let tokenPayload;
	try {
		tokenPayload = jwt.verify(accessToken, process.env.SECRET_KEY);
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_ACCESSTOKEN);
		}
		return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_ACCESSTOKEN);
	}

	// Check blacklist
	let data = await redisClient.get(accessToken);
	if (data !== null) {
		return res.status(httpStatus.UNAUTHORIZED).send(INVALID_ACCESSTOKEN);
	}

	req.accessTokenPayload = tokenPayload;
	return next();
}
