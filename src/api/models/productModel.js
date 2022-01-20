import db from '../connection/db.js';
import generate from './generic.model.js';

let productModel = generate('products', 'product_id');

productModel.findBySellerId = async (seller_id) => {
	const row = await db('products').where('seller_id', seller_id);
	return row;
};

productModel.search = async (query, sort, page, category, number_product) => {
	let SQLquery = db('products')
		.leftJoin('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('biddings.product_id')
		.count('biddings.product_id as bidding_count')
		.select('products.*')
		.where('is_sold', 0)
		.andWhereRaw('end_at > now()');

	// Search query
	if (query) {
		SQLquery = SQLquery.whereRaw(`match(name) against('${query}')`);
	}

	// Filter category
	if (category) {
		SQLquery = SQLquery.where('category_id', category);
	}

	// Sort
	if (sort) {
		if (sort === 'time_asc') SQLquery = SQLquery.orderBy('end_at', 'asc');
		if (sort === 'time_desc') SQLquery = SQLquery.orderBy('end_at', 'desc');
		if (sort === 'price_asc') SQLquery = SQLquery.orderBy('current_price', 'asc');
		if (sort === 'price_desc') SQLquery = SQLquery.orderBy('current_price', 'desc');
		if (sort === 'bidding_asc') SQLquery = SQLquery.orderBy('bidding_count', 'asc');
		if (sort === 'bidding_desc') SQLquery = SQLquery.orderBy('bidding_count', 'desc');
	}

	// Products per page
	if (number_product) {
		SQLquery = SQLquery.limit(number_product);
	}

	// Page
	if (page) {
		// If have page but not have number product is default to 6
		SQLquery = number_product ? SQLquery.offset(page * number_product) : SQLquery.offset(page * 6).limit(6);
	}

	// excute
	const row = await SQLquery;
	return row;
};

productModel.getProduct = async (product_id) => {
	let SQLquery = db('products')
		.leftJoin('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('products.product_id')
		.count('products.product_id as bidding_count')
		.select('products.*')
		.where('products.product_id', product_id)
		.andWhere('is_valid', 1);

	const row = await SQLquery;
	if (row.length === 0) {
		return null;
	}

	return row[0];
};

// use in autobidding get product uniclude one bidding
productModel.getProductUseAutoBidding = async function (product_id, bidding_id = null) {
	let SQLquery = db('products')
		.join('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('products.product_id')
		.max('biddings.max_price as current_max_price')
		.max('biddings.bid_price as current_max_bid_price')
		.select('products.*')
		.where('products.product_id', product_id)
		.andWhere('is_valid', 1);
	if (bidding_id) {
		SQLquery = SQLquery.whereRaw(`biddings.bidding_id != ${bidding_id}`);
	}
	const row = await SQLquery;
	if (row.length === 0) return null;

	return row[0];
};

productModel.isInBidding = async function (product_id) {
	const row = await db('biddings').where('product_id', product_id);
	if (row && row.length > 0) return true;
	return false;
};

productModel.getImages = async function (product_id) {
	const row = await db('product_images').where('product_id', product_id).select('product_image_id', 'path', 'is_primary');
	return row;
};

productModel.removeProduct = async function (product_id) {
	await db('products').where('product_id', product_id).del();
};

productModel.getDescriptions = async function (product_id) {
	const row = await db('product_descriptions')
		.where('product_id', product_id)
		.orderBy('upload_date', 'asc')
		.select('product_description_id', 'description', 'upload_date');
	return row;
};

productModel.addImage = async function (product_id, path_image, is_primary) {
	const entity = {
		product_id: product_id,
		path: path_image,
	};
	if (is_primary) {
		entity.is_primary = is_primary;
	}
	return await db('product_images').insert(entity);
};

productModel.addDescription = async function (entity) {
	return await db('product_descriptions').insert(entity);
};

productModel.deleteDescription = async function (product_id, description_id) {
	return await db('product_descriptions').where('product_id', product_id).where('product_description_id', description_id).del();
};

productModel.findImage = async function (product_id, image_id) {
	const list = await db('product_images').where('product_id', product_id).where('product_image_id', image_id);
	if (list.length === 0) return null;

	return list[0];
};

productModel.findDescription = async function (product_id, description_id) {
	const list = await db('product_descriptions').where('product_id', product_id).where('product_description_id', description_id);
	if (list.length === 0) return null;

	return list[0];
};

productModel.deleteImage = async function (product_id, image_id) {
	return await db('product_images').where('product_id', product_id).where('product_image_id', image_id).del();
};

productModel.productsBidding = async function (user_id) {
	return await db('products')
		.leftJoin('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('biddings.product_id')
		.count('biddings.product_id as bidding_count')
		.select('products.*')
		.where('user_id', user_id)
		.andWhere('is_sold', 0);
};

productModel.productsActive = async function (user_id) {
	return await db('products')
		.leftJoin('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('biddings.product_id')
		.count('biddings.product_id as bidding_count')
		.select('products.*')
		.where('seller_id', user_id)
		.andWhere('is_sold', 0);
};

productModel.productsInActive = async function (user_id) {
	return await db('products')
		.leftJoin('biddings', 'biddings.product_id', 'products.product_id')
		.groupBy('biddings.product_id')
		.count('biddings.product_id as bidding_count')
		.select('products.*')
		.where('seller_id', user_id)
		.andWhere('is_sold', 1);
};

productModel.getAllBidding = async function (product_id) {
	return await db('biddings')
		.leftJoin('users', 'users.user_id', 'biddings.user_id')
		.where('product_id', product_id)
		.andWhere('is_valid', 1)
		.select('biddings.*')
		.select('full_name');
};

productModel.getAllProductEnd = async function () {
	// use to check won
	return await db('products').whereRaw('end_at < now()').andWhere('is_sold', 0);
};

productModel.updateTimeWhenBidding = async function (product_id) {
	// use to update time end_at when <= 5 minute
	return await db.raw(`update products set end_at = DATE_ADD(now(), INTERVAL 10 minute)
    where abs(TIMESTAMPDIFF(SECOND, end_at, now())) < 5 * 60 
    and end_at > now()
    and product_id = ${product_id}`);
};

productModel.updateEndAtEquaNow = async function (product_id) {
	// use to update time end_at when <= 5 minute
	return await db.raw(`update products set end_at = now()
    where product_id = ${product_id}`);
};

productModel.getBiddingProducts = async (user_id) => {
	return await db('biddings')
		.leftJoin('products', 'biddings.product_id', 'products.product_id')
		.where('biddings.user_id', user_id)
		.andWhere('products.is_sold', 0)
		.select('products.*')
		.distinct();
};

productModel.getHasWonProducts = async function (user_id) {
	return await db('products').where('buyer_id', user_id).andWhere('is_sold', 1).select('products.*');
};

productModel.getFinishedProduct = async function (product_id) {
	return await db('products').select('products.*').where('is_sold', 1).andWhere('product_id', product_id);
};

productModel.getRate = async (product_id) => {
	return await db('rates').select('rates.*').where('product_id', product_id);
};

export default productModel;
