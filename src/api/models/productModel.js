import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let productModel = generate('products', 'product_id');
productModel.findBySellerId = async function (seller_id) {
    const row = await db('products').where('seller_id', seller_id);
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
    const row = await db('product_descriptions').where('product_id', product_id).select("product_description_id","description","upload_date");
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