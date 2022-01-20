import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { NOT_PERMISSION } from '../helpers/constants/errors';
dotenv.config();

export default function isAdmin(req, res, next) {
	if (req.accessTokenPayload.userRole !== 'admin') {
		return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
	}
	return next();
}
