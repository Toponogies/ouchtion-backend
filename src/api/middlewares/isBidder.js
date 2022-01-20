import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { NOT_PERMISSION } from '../helpers/constants/errors';
dotenv.config();

export default function isBidder(req, res, next) {
	if (req.accessTokenPayload.userRole !== 'bidder') {
		return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
	}
	return next();
}
