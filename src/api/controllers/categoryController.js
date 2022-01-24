import httpStatus from 'http-status-codes';
import { BAD_REQUEST, NOT_FOUND_CATEGORY, UNEXPECTED_ERROR, RELATED_ENTITY } from '../helpers/constants/errors';
import { CategoryModel } from '../models';
import { getIO } from '../helpers/constants/socketIO';
import { CATEGORY_LIST_UPDATE } from '../helpers/constants/keyConstant';

export default {
	getCategories: async (_req, res) => {
		try {
			const categories = await CategoryModel.findAll();
			return res.status(httpStatus.OK).send(categories);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getCategory: async (req, res) => {
		try {
			const category = await CategoryModel.findById(req.params.id);

			if (category === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_CATEGORY);
			}
			return res.status(httpStatus.OK).send(category);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	addCategory: async (req, res) => {
		try {
			let category = req.body;
			let categoryIds = await CategoryModel.add(category);
			category.category_id = categoryIds[0];

			// socket emit
			getIO().emit(CATEGORY_LIST_UPDATE, null);

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
			await CategoryModel.patch(id, category);
			category.category_id = id;

			// socket emit
			getIO().emit(CATEGORY_LIST_UPDATE, null);

			return res.status(httpStatus.OK).send(category);
		} catch (err) {
			if (err.errno === 1452) {
				return res.status(httpStatus.BAD_REQUEST).send(RELATED_ENTITY);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	deleteCategory: async (req, res) => {
		// Can delete if does not have product or child category
		try {
			const id = req.params.id;
			// Check if category exist
			const category = await CategoryModel.findById(id);
			if (category === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_CATEGORY);
			}

			await CategoryModel.removeById(id);

			// socket emit
			getIO().emit(CATEGORY_LIST_UPDATE, null);

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			if (err.errno === 1451) {
				return res.status(httpStatus.BAD_REQUEST).send(RELATED_ENTITY);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
};
