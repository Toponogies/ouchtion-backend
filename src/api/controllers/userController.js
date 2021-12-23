import httpStatus from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import { EXPIRED_VERIFYTOKEN, INVAILD_VERIFYTOKEN, IS_EXIST, NOT_FOUND_FILE, NOT_FOUND_IMAGE, NOT_FOUND_PRODUCT, NOT_FOUND_USER, NOT_FOUND_WATCH, NOT_PERMISSION, PRODUCT_NOT_END, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import sendMail from '../helpers/constants/sendEmail';
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
    sendNewEmail: async (req, res) => {
        try{
            const email = req.query.email

            //find user by email
            const user = await userModel.findByEmail(email);
            if (user !== null) {
                return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
            }

            // check product exist
            if (user === null) {
                return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
            }

            // check user id and user id in token
            if (req.accessTokenPayload.userId != req.params.id) {
                return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
            }

            // create new token
            const payload = { 
                userId:user.user_id,
                email:email 
            };
            const optsAccess = {
                expiresIn: process.env.REDIS_EXPIRED_VERIFYTOKEN_SECOND
            };
            const token = jwt.sign(payload, process.env.SERET_KEY, optsAccess);

            let mailOptions = { // update text if have frontend
                from: 'norely@gmail.com', 
                to: email, 
                subject: 'Update email token',
                text: `Link to update email : http://localhost:3000/updateEmail?token=${token}`
            };

            sendMail(mailOptions)
            return res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            console.log(err);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
    updateEmail: async (req, res) => {
        try{
            const token = req.query.token
            // 2 temp variable
            var _userId = -1;
            var _email = "";

            // verify token and get user id
            try {
                const { userId,email } = jwt.verify(token, process.env.SERET_KEY);
                _userId = userId;
                _email = email;
            } catch (err) {
                if (error.name === "TokenExpiredError")
                    return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN)
                else
                    return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN)
            }

            await userModel.patch(_userId,{email:_email})
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

            // check if user is bidder
            if (req.accessTokenPayload.role === "bidder")
            {
                const products = await userModel.getAllProductBidderNotRate(req.params.id)
                return res.send(products)
            }

            //check if user is seller
            if (req.accessTokenPayload.role === "seller")
            {
                const products = await userModel.getAllProductSellerNotRate(req.params.id)
                return res.send(products)
            }
            return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION)
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

            // if user is bidder
            if (req.accessTokenPayload.role === "bidder")
            {
                // check product finish
                const isCanRate = await userModel.isBidderCanRate(req.params.id,req.body.product_id)
                if (!isCanRate){
                    return res.status(httpStatus.BAD_REQUEST).send(PRODUCT_NOT_END);
                }

                // check rate exist
                const isInRate = await userModel.isBidderInRate(req.params.id,req.body.product_id)
                if (isInRate){
                    return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
                }

                // add rate
                req.body.type = "BUYER-SELLER"
                const n = await userModel.postRate(req.params.id,req.body)
                if (n === 0) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
                }
                return res.status(httpStatus.NO_CONTENT).send();
            }

            //if user is seller
            if (req.accessTokenPayload.role === "seller")
            {
                // check product finish
                const isCanRate = await userModel.isSellerCanRate(req.params.id,req.body.product_id)
                if (!isCanRate){
                    return res.status(httpStatus.BAD_REQUEST).send(PRODUCT_NOT_END);
                }

                // check rate exist
                const isInRate = await userModel.isSellerInRate(req.params.id,req.body.product_id)
                if (isInRate){
                    return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
                }

                // add rate
                req.body.type = "SELLER-BUYER"
                const n = await userModel.postRate(req.params.id,req.body)
                if (n === 0) {
                    return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_PRODUCT);
                }
                return res.status(httpStatus.NO_CONTENT).send();
            }
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

            // check watch exist
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