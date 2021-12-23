import httpStatus from 'http-status-codes';
import { NOT_FOUND_CATEGORY, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import categoryModel from '../models/categoryModel';

export default {
    getAllCategory: async (req, res) => {
        try {
            const categorys = await categoryModel.findAll()
            return res.json(categorys);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllChildCategory: async (req, res) => {
        try {
            const categorys = await categoryModel.getAllChildCategory(req.params.id)
            return res.json(categorys);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    addCategory: async (req, res) => {
        try {
            // check role of admin
            if (req.accessTokenPayload.role !== "admin") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            await categoryModel.add(req.body)
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteCategory: async (req, res) => { // can delete if not have product or child category
        try {
            // check role of admin
            if (req.accessTokenPayload.role !== "admin") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            
            // check category exist
            const category = categoryModel.findById(req.params.id);
            if (category === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_CATEGORY)
            }

            await categoryModel.removeById(req.params.id)
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
}