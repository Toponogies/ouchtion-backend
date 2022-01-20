import httpStatus from 'http-status-codes';
import { NOT_FOUND_PRODUCT, NOT_PERMISSION, UNEXPECTED_ERROR } from '../helpers/constants/errors.js';
import { ProductModel } from '../models';

export default async function isProductOwner(req, res, next) {
	try {
		// get product by id
		const product = await ProductModel.findById(req.params.id);

		// check product exist
		if (product === null) {
			return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
		}

		if (req.accessTokenPayload.userId !== product.seller_id) {
			return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
		}
		req.product = product;
		return next();
	} catch (e) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
	}
}
