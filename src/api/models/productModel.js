import db from '../helpers/constants/db.js';
import generate from './generic.model.js';
import dotenv from 'dotenv';
dotenv.config();

let productModel = generate('products', 'product_id');
productModel.findBySellerId = async function (seller_id) {
    const row = await db('products').where('seller_id', seller_id);
    return row;
}
productModel.search = async function (query,sort,page,category) {
    page = page ? page:0;
    let SQLquery = db('products').join('biddings',"biddings.product_id","products.product_id")
    .groupBy("products.product_id")
    .count("products.product_id as bidding_count")
    .max("biddings.bid_price as bidding_max")
    .select("products.*")
    // search query
    if (query) {
        SQLquery = SQLquery.whereRaw(
            `name LIKE '%${query}%'`)
    }
    // filter category
    if (category) {
        SQLquery = SQLquery.where("category_id", category)
    }
    //sort
    if (sort) {
        if (sort === "time_desc")
            SQLquery = SQLquery.orderBy('end_at', 'desc')
        if (sort === "price_asc")
            SQLquery = SQLquery.orderBy('bidding_max', 'asc')
    }
    // page
    SQLquery = SQLquery.limit(process.env.NUMBER_PRODUCT_PER_PAGE).offset(page * process.env.NUMBER_PRODUCT_PER_PAGE)
    // excute
    const row = await SQLquery;
    return row;
}
productModel.isInBidding = async function (product_id) {
    const row = await db('biddings').where('product_id', product_id);
    if (row && row.length > 0)
        return true;
    return false;
}
productModel.removeProduct = async function (product_id) {
    await db('product_images').where('product_id', product_id).del();
    await db('product_descriptions').where('product_id', product_id).del();
    await db('products').where('product_id', product_id).del();
}
productModel.getImages = async function (product_id) {
    const row = await db('product_images').where('product_id', product_id).select("product_image_id","path","is_primary");
    return row;
}
productModel.getDescriptions = async function (product_id) {
    const row = await db('product_descriptions').where('product_id', product_id).orderBy('upload_date', 'desc').select("product_description_id","description","upload_date");
    return row;
}
productModel.addImage = async function (product_id,path_image,is_primary) {
    const entity = {
        product_id:product_id,
        path:path_image,
    }
    if (is_primary)
    {
        entity.is_primary = is_primary
    }
    return db("product_images").insert(entity);
}
productModel.addDescription = async function (entity) {
    return db("product_descriptions").insert(entity);
}
productModel.deleteDescription = async function (product_id, description_id) {
    return db("product_descriptions")
    .where("product_id", product_id)
    .where("product_description_id", description_id)
    .del();
}
productModel.findImage = async function (product_id, image_id) {
    const list = await db("product_images")
    .where("product_id", product_id)
    .where("product_image_id", image_id)
    if (list.length === 0)
    return null;

    return list[0];
}
productModel.deleteImage = async function (product_id, image_id) {
    return db("product_images")
    .where("product_id", product_id)
    .where("product_image_id", image_id)
    .del();
}

export default productModel;