import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let userModel = generate('users', 'user_id');
userModel.findByEmail = async function (email) {
    const row = await db('users').where('email', email);
    if (row.length == 0) {
        return null;
    }
    return row[0];
};
userModel.getPoint = async function (user_id) {
    const row1 = await db('products').join('rates','rates.product_id','products.product_id').sum('rate as sum_like').whereRaw(`((products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')) and rate > 0`);
    const row2 = await db('products').join('rates','rates.product_id','products.product_id').count('rate as count_rate').whereRaw(`(products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')`);
    const sum_like = row1[0].sum_like ? row1[0].sum_like : 0;
    const count_rate = row2[0].count_rate ? row2[0].count_rate : 1;
    const user = await this.findById(user_id);
    user.point = (sum_like / count_rate).toFixed(2) * 100;
    return {
        full_name: user.full_name,
        point: user.point
    };
};
userModel.getAllBidding = async function (user_id) {
    return db('biddings').where('user_id',user_id).orderBy('time','desc');
};
userModel.getAllRate = async function (user_id) {
    return await db('products').join('rates','rates.product_id','products.product_id').whereRaw(`(products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')`);
};
userModel.getAllProductBidderNotRate = async function (user_id) {
    return await db('products').whereRaw(`products.buyer_id= ${user_id} and is_sold = 1 and product_id not in(
    select products.product_id from products join rates on rates.product_id = products.product_id 
    where products.buyer_id= ${user_id} and type = 'BUYER-SELLER')`);
};
userModel.getAllProductSellerNotRate = async function (user_id) {
    return await db('products').whereRaw(`products.seller_id= ${user_id} and is_sold = 1 and product_id not in(
    select products.product_id from products join rates on rates.product_id = products.product_id 
    where products.seller_id= ${user_id} and type = 'SELLER-BUYER')`);
};
userModel.isBidderInRate = async function(user_id,product_id){
    const row =  await db('products').join('rates','rates.product_id','products.product_id').whereRaw(`products.product_id = ${product_id} and products.buyer_id= ${user_id} and type = 'BUYER-SELLER'`);
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};
userModel.isBidderCanRate = async function(user_id,product_id){
    const row =  await db('products').whereRaw(`products.product_id = ${product_id} and products.buyer_id= ${user_id} and is_sold = 1`);
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};
userModel.isSellerInRate = async function(user_id,product_id){
    const row =  await db('products').join('rates','rates.product_id','products.product_id').whereRaw(`products.product_id = ${product_id} and products.seller_id= ${user_id} and type = 'SELLER-BUYER'`);
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};
userModel.isSellerCanRate = async function(user_id,product_id){
    const row =  await db('products').whereRaw(`products.product_id = ${product_id} and products.seller_id= ${user_id} and is_sold = 1`);
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};
userModel.isInWatchList = async function (user_id,product_id) {
    const row = await db('watchlists').where('user_id',user_id).andWhere('product_id',product_id);
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};
userModel.getWatchList = async function (user_id) {
    return await db('watchlists').where('user_id',user_id);
};
userModel.biddingHistory = async function (product_id) {
    return await db('biddings').where('product_id',product_id);
};
userModel.postRate = async function (entity) {
    return await db('rates')
        .insert(entity);
};
userModel.addWatch = async function (user_id,product_id) {
    return await db('watchlists')
        .insert({
            user_id:user_id,
            product_id:product_id
        });
};
userModel.deleteWatch = async function (user_id,product_id) {
    return await db('watchlists').where('user_id',user_id).andWhere('product_id',product_id).del();
};

userModel.isHaveUpgrageSellerRequest = async function (user_id) {
    const row = await db('upgrage_seller_request').where('user_id',user_id).whereRaw('abs(TIMESTAMPDIFF(DAY, time, now())) < 7');
    if (row && row.length > 0)
    {
        return true;
    }
    return false;
};

userModel.sendUpgrageSellerRequest = async function (body) {
    return await db('upgrage_seller_request').insert(body);
};

userModel.getAllRequestSeller = async function () {
    return await db('upgrage_seller_request');
};

userModel.getPoint = async function (user_id) {
    const row1 = await db('products').join('rates','rates.product_id','products.product_id').sum('rate as sum_like').whereRaw(`((products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')) and rate > 0`);
    const row2 = await db('products').join('rates','rates.product_id','products.product_id').count('rate as count_rate').whereRaw(`(products.buyer_id= ${user_id} and type = 'SELLER-BUYER') or (products.seller_id= ${user_id} and type = 'BUYER-SELLER')`);
    const sum_like = row1[0].sum_like ? row1[0].sum_like : 0;
    const count_rate = row2[0].count_rate ? row2[0].count_rate : 1;
    const user = await this.findById(user_id);
    user.point = (sum_like / count_rate).toFixed(2) * 100;
    return {
        full_name: user.full_name,
        point: user.point
    };
};

export default userModel;