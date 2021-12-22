import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
import { biddingModel,productModel } from "../models";
import { BAD_BIDDING, IS_EXIST, NOT_FOUND_BIDDING, NOT_FOUND_PRODUCT, NOT_PERMISSION, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
dotenv.config();

export default {
    addAutoBidding: async (req, res) => {
        try {
            // check product exist
            const product = await productModel.findById(req.body.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            req.body.user_id = req.accessTokenPayload.userId;
            req.body.bid_price = product.init_price;
            req.body.is_auto_process = 1;
            // check role only bidder
            if (req.accessTokenPayload.role !== "bidder") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const checkBiddingPermission = await biddingModel.isBiddingPermission(req.body);
            if (checkBiddingPermission === false){
                return res.status(httpStatus.UNAUTHORIZED).send(BAD_BIDDING);
            }

            await biddingModel.add(req.body);
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    addBidding: async(req, res) => {
        try {
            req.body.user_id = req.accessTokenPayload.userId;
            // check role only bidder
            if (req.accessTokenPayload.role !== "bidder") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // check product exist
            const product = await productModel.findById(req.body.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            const check = await biddingModel.addBidding(req.body);
            if (check === false){
                return res.status(httpStatus.UNAUTHORIZED).send(BAD_BIDDING)
            }

            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    addBiddingRequest: async(req, res) => {
        try {
            req.body.user_id = req.accessTokenPayload.userId;
            // check role only bidder
            if (req.accessTokenPayload.role !== "bidder") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // check product exist
            const product = await productModel.findById(req.body.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }

            const check = await biddingModel.isHaveBiddingRequest(req.body);
            if (check === true)
            {
                return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
            }

            await biddingModel.addBiddingRequest(req.body);
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    getBiddingRequests: async(req, res) =>{
        try {
            // check role only bidder
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const biddingRequests = await biddingModel.getBiddingRequests(req.accessTokenPayload.userId);
            return res.json(biddingRequests);
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    permissionBidding: async(req, res) =>{
        try {
            // check role only bidder
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // get product with id and check the seller
            const product = await productModel.findById(req.body.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            await biddingModel.permissionBidding(req.body);
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    notAllowBidding: async(req, res) =>{
        try {
            // check role only bidder
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // get product with id and check the seller
            const product = await productModel.findById(req.body.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            await biddingModel.notAllowBidding(req.body);
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    rejectBidding: async(req, res) =>{
        try {
            // check role only bidder
            if (req.accessTokenPayload.role !== "seller") {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            const bidding = await biddingModel.findById(req.params.id)
            if (bidding === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_BIDDING);
            }

            // get product with id and check the seller
            const product = await productModel.findById(bidding.product_id);
            if (product === null)
            {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
            }
            if (req.accessTokenPayload.userId !== product.seller_id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            await biddingModel.rejectBidding(bidding.bidding_id);
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
}