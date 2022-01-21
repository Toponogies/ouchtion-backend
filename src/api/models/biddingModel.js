import db from '../connection/db.js';
import sendEmail from '../helpers/classes/sendEmail';
import generate from './generic.model.js';
import productModel from './productModel.js';
import userModel from './userModel.js';

let biddingModel = generate('biddings', 'bidding_id');

// add one bidding
biddingModel.addBidding = async function (body) {
	const product = await productModel.getProductUseAutoBidding(body.product_id);

	// get bidding id bidding add
	let biddingId = await biddingModel.add(body);
	biddingId = biddingId[0];

	// update time product end
	// Check is extendable
	if (product.is_extendable === '1') {
		await productModel.updateTimeWhenBidding(product.product_id);
	}

	product.current_max_price =
		product.current_max_price > product.current_price ? product.current_max_price : product.current_price;
	if (product.current_max_price < body.bid_price) {
		await productModel.patch(product.product_id, {
			buyer_id: body.user_id,
			current_price: body.bid_price,
		});
	}
	if (product !== null) {
		// find seller and bidder
		const seller = await userModel.findById(product.seller_id);
		const price_holder = await userModel.findById(product.buyer_id);
		const bidder = await userModel.findById(body.user_id);

		let mailSellerOptions = {
			// mail to seller
			from: 'norely@gmail.com',
			to: seller.email,
			subject: 'Product have new bidding',
			text: `Your product name ${product.name} has new bidding from user id ${body.user_id}`,
		};
		await sendEmail(mailSellerOptions);

		let mailBidderOptions = {
			// mail to bidding's bidder
			from: 'norely@gmail.com',
			to: bidder.email,
			subject: 'Bidding success',
			text: `Your bidding of product name ${product.name} has success`,
		};
		await sendEmail(mailBidderOptions);
		if (price_holder) {
			let mailPriceHolderOptions = {
				// mail to current price buyer
				from: 'norely@gmail.com',
				to: price_holder.email,
				subject: 'Product have new bidding',
				text: `Product name ${product.name} has new bidding`,
			};
			await sendEmail(mailPriceHolderOptions);
		}
	}
};

biddingModel.findAllUserId = async function (product_id) {
	const list = await db('biddings').where('product_id', product_id).select('user_id').groupBy('user_id');
	return list;
};

biddingModel.isHaveBiddingRequest = async function (body) {
	const list = await db('bidding_approval_requests').where('user_id', body.user_id).andWhere('product_id', body.product_id);
	return list;
};

biddingModel.isBiddingPermission = async function (body) {
	const product = await productModel.findById(body.product_id);
	if (product.is_sold !== 0) {
		return false;
	}

	const list = await db('bidding_permissions').where('user_id', body.user_id).andWhere('product_id', body.product_id);
	if (list.length === 0) {
		const { point } = await userModel.getPoint(body.user_id);
		return point > 8;
	}
	return list[0].type === 'APPROVE';
};

biddingModel.addBiddingRequest = async function (body) {
	body.is_processed = false;
	await db('bidding_approval_requests').insert(body);
};

biddingModel.getBiddingRequests = async function (product_id) {
	return await db('bidding_approval_requests')
		.leftJoin('products', 'products.product_id', 'bidding_approval_requests.product_id')
		.leftJoin('users', 'users.user_id', 'bidding_approval_requests.user_id')
		.where('bidding_approval_requests.product_id', product_id)
		.andWhere('is_processed', 0);
};

biddingModel.permissionBidding = async function (body) {
	try {
		await db('bidding_permissions').insert(body);
	} catch (err) {
		await db('bidding_permissions').where('user_id', body.user_id).andWhere('product_id', body.product_id).update(body);
	}
	await db('bidding_approval_requests')
		.where('user_id', body.user_id)
		.andWhere('product_id', body.product_id)
		.update({ is_processed: 1 });
};

biddingModel.getBiddingPermissionProduct = async function (product_id) {
	return await db('bidding_permissions').where('product_id', product_id);
};

biddingModel.getAllAutoBiddingValid = async function () {
	return await db('biddings')
		.whereRaw('max_price IS NOT NULL')
		.andWhere('is_auto_process', 1)
		.andWhere('is_valid', 1)
		.orderBy('time', 'asc');
};

biddingModel.disableOneAutoBidding = async function (bidding_id) {
	await db('biddings').where('bidding_id', bidding_id).update({
		is_auto_process: 0,
	});
};

biddingModel.disableAutoBidding = async function (user_id, product_id) {
	await db('biddings').where('user_id', user_id).andWhere('product_id', product_id).update({
		is_auto_process: 0,
	});
};

biddingModel.disableAutoBiddingByUserIdBiddingId = async function (user_id, bidding_id) {
	await db('biddings').where('user_id', user_id).andWhere('bidding_id', bidding_id).update({
		is_auto_process: 0,
	});
};

biddingModel.disableAutoBiddingWithProductId = async function (product_id) {
	await db('biddings').where('product_id', product_id).update({
		is_auto_process: 0,
	});
};

biddingModel.secondBidding = async function (product_id) {
	const list = await db('biddings')
		.where('product_id', product_id)
		.andWhere('is_valid', 1)
		.orderBy('bid_price', 'desc')
		.limit(1);
	if (list.length === 0) return null;

	return list[0];
};

biddingModel.rejectBidding = async function (bidding_id) {
	const bidding = await biddingModel.findById(bidding_id);
	const product = await productModel.getProduct(bidding.product_id);
	if (product.is_sold === 1) {
		return false;
	}
	const user = await userModel.findById(bidding.user_id);
	await db('biddings').where('user_id', bidding.user_id).update({
		is_valid: 0,
	});

	let mailBidderOptions = {
		// mail to bidding's bidder have reject
		from: 'norely@gmail.com',
		to: user.email,
		subject: 'Bidding reject',
		text: `All your bidding of product name ${product.name} has deny, you can't bidding in this product`,
	};
	await sendEmail(mailBidderOptions);

	if (product.buyer_id === bidding.user_id) {
		//disable autobidding with userid
		await biddingModel.disableAutoBidding(bidding.user_id, product.product_id);

		const secondBidding = await biddingModel.secondBidding(product.product_id);
		//if not have second bidding
		if (secondBidding === null) {
			await productModel.patch(product.product_id, {
				buyer_id: null,
				current_price: product.init_price,
			});
			return true;
		}
		// if have second bidding
		await productModel.patch(product.product_id, {
			buyer_id: secondBidding.user_id,
			current_price: secondBidding.bid_price,
		});

		const body = {
			type: 'DENY',
			user_id: bidding.user_id,
			product_id: product.product_id,
			reason: 'Deny bidding this product',
		};

		try {
			await db('bidding_permissions').insert(body);
		} catch (err) {
			await db('bidding_permissions').where('user_id', body.user_id).andWhere('product_id', body.product_id).update(body);
		}
	}

	return true;
};

biddingModel.buyNowProduct = async function (body) {
	body.max_price = 0;
	const checkBiddingPermission = await biddingModel.isBiddingPermission(body);
	if (checkBiddingPermission === false) {
		return false;
	}

	const product = await productModel.findById(body.product_id);
	if (product.buy_price !== null) {
		await biddingModel.disableAutoBiddingWithProductId(body.product_id);
		await productModel.patch(body.product_id, {
			buyer_id: body.user_id,
			current_price: product.buy_price,
		});
		await productModel.updateEndAtEquaNow(body.product_id);
		return true;
	}
	return false;
};

biddingModel.getAllBiddingUser = async function (user_id) {
	return await db('biddings').where('user_id', user_id);
};

export default biddingModel;
