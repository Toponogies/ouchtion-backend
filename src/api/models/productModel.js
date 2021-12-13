import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let productModel = generate('products', 'product_id');
productModel.findBySellerId = async function (seller_id) {
    const row = await db('products').where('seller_id', seller_id);
    return row;
}
productModel.getImages = async function (product_id) {
    const row = await db('product_images').where('product_id', product_id).select("path","is_primary");
    return row;
}
productModel.getDescriptions = async function (product_id) {
    const row = await db('product_descriptions').where('product_id', product_id).select("description","upload_date","is_init");
    return row;
}
export default productModel;