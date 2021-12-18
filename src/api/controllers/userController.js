import httpStatus from 'http-status-codes';
import { IS_EXIST, NOT_FOUND_FILE, NOT_FOUND_IMAGE, NOT_FOUND_PRODUCT, NOT_FOUND_USER, NOT_FOUND_WATCH, NOT_PERMISSION, PRODUCT_NOT_END, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { userModel } from "../models";

export default {
    getPoint: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            const result = await userModel.getPoint(req.params.id)
            res.json(result)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getUser: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            delete user.password
            delete user.is_active
            delete user.role

            console.log(req.accessTokenPayload.userId, req.params.id)
            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateUser: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const n = await userModel.patch(req.params.id,req.body)
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllBidding: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const biddings = await userModel.getAllBidding(req.params.id)
            return res.send(biddings)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllRate: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const rates = await userModel.getAllRate(req.params.id)
            return res.send(rates)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getAllProductNotRate: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const products = await userModel.getAllProductNotRate(req.params.id)
            return res.send(products)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getWatchList: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const watchlist = await userModel.getWatchList(req.params.id)
            return res.send(watchlist)
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    postRate: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const isCanRate = await userModel.isCanRate(req.params.id,req.body.product_id)
            if (!isCanRate){
                return res.status(httpStatus.BAD_REQUEST).send(PRODUCT_NOT_END);
            }
            const isInRate = await userModel.isInRate(req.params.id,req.body.product_id)
            if (isInRate){
                return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
            }
            const n = await userModel.postRate(req.params.id,req.body)
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    addWatch: async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }
            const isInWatchList = await userModel.isInWatchList(req.params.id,req.body.product_id)
            if (isInWatchList){
                return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
            }
            const n = await userModel.addWatch(req.params.id,req.body.product_id)
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    deleteWatch:  async (req, res) => {
        try{
            // get user by id
            const user = await userModel.findById(req.params.id);

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const n = await userModel.deleteWatch(req.params.id,req.body.product_id)
            if (n === 0) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_WATCH);
            }
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
}    