import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import {
	BAD_DELETE,
	DB_QUERY_ERROR,
	EXPIRED_VERIFYTOKEN,
	INVALID_VERIFYTOKEN,
	IS_EXIST,
	NOT_FOUND_USER,
	NOT_PERMISSION,
	PRODUCT_NOT_END,
	RELATED_ENTITY,
	SEND_REQUEST_EXIST,
	UNEXPECTED_ERROR,
	WRONG_PASSWORD,
} from '../helpers/constants/errors';

import sendEmail from '../helpers/classes/sendEmail';
import { UserModel } from '../models';
import { getIO } from '../helpers/constants/socketIO';

export default {
	getUser: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.params.id;

			// get user by id
			const user = await UserModel.findById(user_id);

			// check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			delete user.password;
			delete user.is_active;

			res.status(httpStatus.OK).send(user);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	updateUser: async (req, res) => {
		try {
			// Get user id
			const user_id = req.params.id;

			// Get user by id
			const user = await UserModel.findById(user_id);

			// Check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			if (req.accessTokenPayload.userRole !== 'admin') {
				// Check password
				if (bcrypt.compareSync(req.body.password, user.password) === false) {
					return res.status(httpStatus.UNAUTHORIZED).send(WRONG_PASSWORD);
				}
			}

			// Update user
			await UserModel.patch(user_id, req.body);

			// socket emit
			// getIO().emit('updateUser', {
			// 	message: 'User update',
			// 	data: newUser,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	changePassword: async (req, res) => {
		try {
			// Get user id
			const user_id = req.params.id;

			// Get user by id
			const user = await UserModel.findById(user_id);

			// Check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			if (req.accessTokenPayload.userRole !== 'admin') {
				// Check password
				if (bcrypt.compareSync(req.body.old_password, user.password) === false) {
					return res.status(httpStatus.UNAUTHORIZED).send(WRONG_PASSWORD);
				}
			}

			const payload = {
				password: bcrypt.hashSync(req.body.new_password, 10),
			};

			// Update user
			await UserModel.patch(user_id, payload);

			// socket emit
			// getIO().emit('updateUser', {
			// 	message: 'User update',
			// 	data: newUser,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			console.log(err);
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	sendNewEmail: async (req, res) => {
		try {
			const email = req.body.email;

			// Get user id from token
			const user_id = req.params.id;

			// Find user by email
			const userByEmail = await UserModel.findByEmail(email);
			if (userByEmail !== null) {
				return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR);
			}

			const user = await UserModel.findById(user_id);
			// Check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			if (req.accessTokenPayload.userRole !== 'admin') {
				// Check password
				if (!bcrypt.compareSync(req.body.password, user.password)) {
					return res.status(httpStatus.UNAUTHORIZED).send(WRONG_PASSWORD);
				}
			}

			// Create new token
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
			// getIO().emit('addRequestUpgrage', {
			// 	message: 'new request upgrade seller add',
			// 	data: req.body,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getUsers: async (req, res) => {
		try {
			const users = await UserModel.findAll();
			return res.json(users);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	addUser: async (req, res) => {
		try {
			// Hash pass
			req.body.password = bcrypt.hashSync(req.body.password, 10);
			let user;

			// Add user
			user = await UserModel.add(req.body);

			return res.json({ user_id: user[0] });
		} catch (err) {
			if (err.sqlState === '23000') {
				return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	deleteUser: async (req, res) => {
		try {
			// get user id from param
			const user_id = req.params.id;

			const n = await UserModel.removeById(user_id);
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			if (err.errno >= 1450 && err.errno <= 1460) {
				return res.status(httpStatus.BAD_REQUEST).send(RELATED_ENTITY);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	updateRole: async (req, res) => {
		try {
			// Get user id
			const user_id = req.body.user_id;

			// Get user by id
			var user = await UserModel.findById(user_id);

			// Check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const n = await UserModel.patch(user_id, { role: req.body.role });
			if (n === 0) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// socket emit
			// getIO().emit('updateRole', {
			// 	message: 'new role update',
			// 	data: req.body,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getAllRequest: async (req, res) => {
		try {
			const requestSellers = await UserModel.getAllRequestSeller();
			return res.status(httpStatus.OK).send(requestSellers);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	rejectRequest: async (req, res) => {
		try {
			await UserModel.deleteRequestSeller(req.params.id);
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	getAllRate: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;

			// get user by id
			const user = await UserModel.findById(user_id);

			// check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			const rates = await UserModel.getAllRate(user_id);
			return res.status(httpStatus.OK).send(rates);
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	postRate: async (req, res) => {
		try {
			// get user id from token
			const user_id = req.accessTokenPayload.userId;
			// get user by id
			const user = await UserModel.findById(user_id);

			// check user exist
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}

			// if user is bidder
			if (req.accessTokenPayload.userRole === 'bidder') {
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
				// getIO().emit('newRate', {
				// 	message: 'new rate add',
				// 	data: req.body,
				// });

				return res.status(httpStatus.NO_CONTENT).send();
			}

			//if user is seller
			if (req.accessTokenPayload.userRole === 'seller') {
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
				// getIO().emit('newRate', {
				// 	message: 'new rate add',
				// 	data: req.body,
				// });

				return res.status(httpStatus.NO_CONTENT).send();
			}
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

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
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	updateEmail: async (req, res) => {
		try {
			const token = req.body.token;
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
				else return res.status(httpStatus.UNAUTHORIZED).send(INVALID_VERIFYTOKEN);
			}

			await UserModel.patch(_userId, { email: _email });

			// socket emit
			// getIO().emit('updateEmail', {
			// 	message: 'Update email of user',
			// 	data: newUser,
			// });

			return res.status(httpStatus.NO_CONTENT).send();
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

			// Check if user is seller
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
};
