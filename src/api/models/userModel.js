import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let userModel = generate('users', 'user_id');
userModel.findByEmail = async function (email) {
    const row = await db('users').where('email', email);
    if (row.length == 0) {
        return null;
    }
    return row[0];
}

userModel.getPoint = async function (user_id) {
    const row1 = await db('products').join('rates',"rates.product_id","products.product_id").sum('rate as sum_like').whereRaw(`((products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')) and rate > 0`)
    const row2 = await db('products').join('rates',"rates.product_id","products.product_id").count('rate as count_rate').whereRaw(`(products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')`)
    const sum_like = row1[0].sum_like ? row1[0].sum_like : 0
    const count_rate = row2[0].count_rate ? row2[0].count_rate : 1
    const user = await this.findById(user_id);
    user.point = (sum_like / count_rate).toFixed(2) * 100;
    return {
        full_name: user.full_name,
        point: user.point
    };
}

export default userModel;