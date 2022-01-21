import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { NOT_PERMISSION } from '../helpers/constants/errors';
dotenv.config();

export default function isPermittedToBid(req, res, next) {
	let userId = req.accessTokenPayload.userId;

	const body = {
		user_id: userId,
		product_id: req.body.product_id,
	};

	let check = await BiddingModel.isBiddingPermission(body);
	if (!check) {
		return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
	}
	return next();
}
