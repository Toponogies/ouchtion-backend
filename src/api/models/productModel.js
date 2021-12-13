import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let productModel = generate('products', 'product_id');
productModel.findBySellerId = async function (seller_id) {
    const row = await db('products').where('seller_id', seller_id);
    return row;
}
export default productModel;