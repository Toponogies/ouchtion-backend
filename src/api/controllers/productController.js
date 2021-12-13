import httpStatus from 'http-status-codes';
import { NOT_FOUND_PRODUCT, NOT_PERMISSION, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { productModel } from "../models";
export default {
    getAllProduct: async (req, res) => {
        try {
            const products = await productModel.findAll();
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllProductBySellerId: async (req, res) => {
        try {
            const products = await productModel.findBySellerId(req.body.user_id);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getProduct: async (req, res) => {
        try {
            const products = await productModel.findById(req.params.id);
            return res.json(products);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (req.accessTokenPayload.id !== product.seller_id)
            {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const n = await productModel.patch(req.params.id,req.body);
            if (n === 0)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            const result = await productModel.findById(req.params.id);
            return res.json(result);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteProduct: async (req, res) =>{
        try {
            if (req.accessTokenPayload.role !== "admin")
            {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const n = await productModel.removeById(req.params.id);
            if (n === 0)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    }
}