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
productModel.updateDescription = async function (product_id,entity) {
    return db("product_descriptions")
    .where("product_id", product_id)
    .update(entity);
}
export default productModel;