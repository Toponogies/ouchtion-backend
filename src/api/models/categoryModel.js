import db from '../connection/db.js';
import generate from './generic.model.js';

let categoryModel = generate('category', 'category_id');
categoryModel.getAllChildCategory = async function (parent_category_id) {
	return await db('category').where('parent_category_id', parent_category_id);
};

export default categoryModel;
