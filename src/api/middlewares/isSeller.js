import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { NOT_PERMISSION } from '../helpers/constants/errors';
dotenv.config();

export default function isSeller(req, res, next) {
	if (req.accessTokenPayload.userRole !== 'seller') {
		return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
	}
	return next();
}
