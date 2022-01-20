import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { NOT_PERMISSION } from '../helpers/constants/errors';
dotenv.config();

export default function isPermittedToUser(req, res, next) {
	let inPathUserId = parseInt(req.params.id);

	if (req.accessTokenPayload.userRole !== 'admin' && req.accessTokenPayload.userId !== inPathUserId) {
		return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
	}
	return next();
}
