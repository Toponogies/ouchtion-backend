import httpStatus from 'http-status-codes';
import { BAD_DELETE, BAD_REQUEST, NOT_FOUND_CATEGORY, UNEXPECTED_ERROR, SUB_ENTITY_EXIST } from '../helpers/constants/errors';
import { CategoryModel } from '../models';
import { getIO } from '../helpers/constants/socketIO';

export default {
	getCategories: async (_req, res) => {
		try {
			const categories = await CategoryModel.findAll();
			return res.status(httpStatus.OK).send(categories);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	addCategory: async (req, res) => {
		try {
			let category = req.body;
			let categoryIds = await CategoryModel.add(category);
			category.category_id = categoryIds[0];

			// // socket emit
			// getIO().emit('addCategory', {
			// 	message: 'new category add',
			// 	data: category,
			// });

			return res.status(httpStatus.CREATED).send(category);
		} catch (err) {
			if (err.errno === 1452) {
				return res.status(httpStatus.BAD_REQUEST).send(BAD_REQUEST);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	updateCategory: async (req, res) => {
		try {
			let id = req.params.id;
			let category = req.body;
			CategoryModel.patch(id, category);
			category.category_id = id;

			// // socket emit
			// getIO().emit('addCategory', {
			// 	message: 'new category add',
			// 	data: category,
			// });

			return res.status(httpStatus.OK).send(category);
		} catch (err) {
			if (err.errno === 1452) {
				return res.status(httpStatus.BAD_REQUEST).send(BAD_REQUEST);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	deleteCategory: async (req, res) => {
		// can delete if not have product or child category
		try {
			const id = req.params.id;
			// Check if category exist
			const category = await CategoryModel.findById(id);
			if (category === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_CATEGORY);
			}

			const childCategory = await CategoryModel.getAllChildCategory(id);
			if (childCategory.length !== 0) {
				return res.status(httpStatus.BAD_REQUEST).send(SUB_ENTITY_EXIST);
			}
			await CategoryModel.removeById(id);

			// socket emit
			// getIO().emit('deleteCategory', {
			// 	message: 'delete category',
			// 	data: category,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			if (err.errno === 1451) {
				return res.status(httpStatus.BAD_REQUEST).send(BAD_DELETE);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
};
