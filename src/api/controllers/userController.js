import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import {
	BAD_DELETE,
	EXPIRED_VERIFYTOKEN,
	INVAILD_VERIFYTOKEN,
	IS_EXIST,
	NOT_FOUND_USER,
	NOT_FOUND_WATCH,
	NOT_PERMISSION,
	PRODUCT_NOT_END,
	SEND_REQUEST_EXIST,
	UNEXPECTED_ERROR,
	WRONG_PASSWORD,
} from '../helpers/constants/errors';

import sendEmail from '../helpers/classes/sendEmail';
import { BiddingModel, UserModel } from '../models';
import { getIO } from '../helpers/constants/socketIO';

export default {
	getPoint: async (req, res) => {
		try {
			// get user by id
			const user = await UserModel.findById(req.params.id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const result = await UserModel.getPoint(req.params.id);
			res.json(result);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getUser: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.params.id;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			delete user.password;
			delete user.is_active;

			res.json(user);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getAllBidding: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const biddings = await BiddingModel.getAllBiddingUser(user_id);
			res.json(biddings);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	updateUser: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// check password
			if (bcrypt.compareSync(req.body.password, user.password) === false) {
				return res.status(httpStatus.UNAUTHORIZED).send(WRONG_PASSWORD);
			}

			if (req.body.newPassword) {
				req.body.password = req.body.newPassword;
				delete req.body.newPassword;
				req.body.password = bcrypt.hashSync(req.body.password, 10);
			} else {
				delete req.body.password;
			}

			const n = await UserModel.patch(user_id, req.body);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const newUser = await UserModel.findById(user_id);

			// socket emit
			getIO().emit('updateUser', {
				message: 'User update',
				data: newUser,
			});

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	sendUpgrageSellerRequest: async (req, res) => {
		try {
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}
			req.body.user_id = user_id;

			const check = await UserModel.isHaveUpgrageSellerRequest(user_id);
			if (check === true) {
				return res.status(httpStatus.BAD_REQUEST).send(SEND_REQUEST_EXIST);
			}

			await UserModel.sendUpgrageSellerRequest(req.body);

			// socket emit
			getIO().emit('addRequestUpgrage', {
				message: 'new request upgrade seller add',
				data: req.body,
			});

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	getAllRequestSeller: async (req, res) => {
		try {
			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}

			const requestSellers = await UserModel.getAllRequestSeller();
			return res.json(requestSellers);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	updateRole: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.body.user_id;

			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}

			// get user by id
			var user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const n = await UserModel.patch(user_id, req.body);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// socket emit
			getIO().emit('updateRole', {
				message: 'new role update',
				data: req.body,
			});

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	getAllUser: async (req, res) => {
		try {
			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}
			const users = await UserModel.findAll();
			return res.json(users);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	sendNewEmail: async (req, res) => {
		try {
			const email = req.body.email;
			// get user id from token
			const user_id = req.accessTokenPayload.userId;

			//find user by email
			const userEmail = await UserModel.findByEmail(email);
			if (userEmail !== null) {
				return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
			}

			const user = await UserModel.findById(user_id);
			// check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// check password
			if (bcrypt.compareSync(req.body.password, user.password) === false) {
				return res.status(httpStatus.UNAUTHORIZED).send(WRONG_PASSWORD);
			}

			// create new token
			const payload = {
				userId: user.user_id,
				email: email,
			};

			const optsAccess = {
				expiresIn: process.env.EXPIRED_VERIFYTOKEN,
			};

			const token = jwt.sign(payload, process.env.SERET_KEY, optsAccess);

			let mailOptions = {
				// update text if have frontend
				from: 'norely@gmail.com',
				to: email,
				subject: 'Update email token',
				text: `Link to update email : ${process.env.URL_FRONTEND}/updateEmail?token=${token}`,
			};

			sendEmail(mailOptions);
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	updateEmail: async (req, res) => {
		try {
			const token = req.query.token;
			// 2 temp variable
			var _userId = -1;
			var _email = '';

			// verify token and get user id
			try {
				const { userId, email } = jwt.verify(token, process.env.SERET_KEY);
				_userId = userId;
				_email = email;
			} catch (err) {
				console.log(err);
				if (err.name === 'TokenExpiredError') return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN);
				else return res.status(httpStatus.UNAUTHORIZED).send(INVAILD_VERIFYTOKEN);
			}

			await UserModel.patch(_userId, { email: _email });

			const newUser = await UserModel.findById(_userId);

			// socket emit
			getIO().emit('updateEmail', {
				message: 'Update email of user',
				data: newUser,
			});

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	getAllRate: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);
			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const rates = await UserModel.getAllRate(user_id);
			return res.send(rates);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	getAllProductNotRate: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// check if user is bidder
			if (req.accessTokenPayload.role === 'bidder') {
				const products = await UserModel.getAllProductBidderNotRate(user_id);
				return res.send(products);
			}

			//check if user is seller
			if (req.accessTokenPayload.role === 'seller') {
				const products = await UserModel.getAllProductSellerNotRate(user_id);
				return res.send(products);
			}
			return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	getWatchList: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const watchlist = await UserModel.getWatchList(user_id);
			return res.send(watchlist);
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	postRate: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// if user is bidder
			if (req.accessTokenPayload.role === 'bidder') {
				// check product finish
				const isCanRate = await UserModel.isBidderCanRate(user_id, req.body.product_id);
				if (!isCanRate) {
					return res.status(httpStatus.BAD_REQUEST).send(PRODUCT_NOT_END);
				}

				// check rate exist
				const isInRate = await UserModel.isBidderInRate(user_id, req.body.product_id);
				if (isInRate) {
					return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
				}

				// add rate
				req.body.type = 'BUYER-SELLER';
				await UserModel.postRate(req.body);

				// socket emit
				getIO().emit('newRate', {
					message: 'new rate add',
					data: req.body,
				});

				return res.status(httpStatus.NO_CONTENT).send();
			}

			//if user is seller
			if (req.accessTokenPayload.role === 'seller') {
				// check product finish
				const isCanRate = await UserModel.isSellerCanRate(user_id, req.body.product_id);
				if (!isCanRate) {
					return res.status(httpStatus.BAD_REQUEST).send(PRODUCT_NOT_END);
				}

				// check rate exist
				const isInRate = await UserModel.isSellerInRate(user_id, req.body.product_id);
				if (isInRate) {
					return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
				}

				// add rate
				req.body.type = 'SELLER-BUYER';
				await UserModel.postRate(req.body);

				// socket emit
				getIO().emit('newRate', {
					message: 'new rate add',
					data: req.body,
				});

				return res.status(httpStatus.NO_CONTENT).send();
			}
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	addWatch: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// check watch exist
			const isInWatchList = await UserModel.isInWatchList(user_id, req.body.product_id);
			if (isInWatchList) {
				return res.status(httpStatus.BAD_REQUEST).send(IS_EXIST);
			}
			await UserModel.addWatch(user_id, req.body.product_id);
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	deleteWatch: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check product exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const n = await UserModel.deleteWatch(user_id, req.body.product_id);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_WATCH);
			}
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	addUserAdmin: async (req, res) => {
		try {
			// check role only admin can delete
			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}

			// Hash pass
			req.body.password = bcrypt.hashSync(req.body.password, 10);
			var user = null;

			// Add user
			try {
				user = await UserModel.add(req.body);
			} catch (err) {
				if (err.sqlState === '23000')
					// conflict email
					return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR);
				return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
			}
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	updateUserAdmin: async (req, res) => {
		try {
			// check role only admin can delete
			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}

			// get user id from param
			const user_id = req.params.id;

			// if have password
			if (req.body.password) {
				// Hash pass
				req.body.password = bcrypt.hashSync(req.body.password, 10);
			}

			const n = await UserModel.patch(user_id, req.body);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
	deleteUserAdmin: async (req, res) => {
		try {
			// check role only admin can delete
			if (req.accessTokenPayload.role !== 'admin') {
				return res.status(httpStatus.UNAUTHORIZED).send(NOT_PERMISSION);
			}

			// get user id from param
			const user_id = req.params.id;

			const n = await UserModel.removeById(user_id);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			if (err.errno >= 1450 && err.errno <= 1460) {
				return res.status(httpStatus.BAD_REQUEST).send(BAD_DELETE);
			}
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},
};
