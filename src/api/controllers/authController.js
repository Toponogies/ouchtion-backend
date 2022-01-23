import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

import {
	ACCOUNT_NOT_ACTIVE,
	DB_QUERY_ERROR,
	EXPIRED_REFRESHTOKEN,
	EXPIRED_VERIFYTOKEN,
	INVALID_REFRESHTOKEN,
	INVALID_VERIFYTOKEN,
	LOGIN_ERROR,
	UNEXPECTED_ERROR,
	INVALID_TOKEN,
	NOT_FOUND_USER,
} from '../helpers/constants/errors';
import redisClient from '../connection/redisClient';
import userModel from '../models/userModel';
import sendEmail from '../helpers/classes/sendEmail';

import { getIO } from '../helpers/constants/socketIO';
import { AUTH_REGISTER } from '../helpers/constants/keyConstant';

const optsAccess = {
	expiresIn: process.env.EXPIRED_ACCESSTOKEN,
};

const optsVerify = {
	expiresIn: process.env.EXPIRED_VERIFYTOKEN,
};

export default {
	register: async (req, res) => {
		let user = req.body;

		// Hash the password
		user.password = bcrypt.hashSync(req.body.password, 10);

		// Set the role
		user.role = 'bidder';

		let userIds;
		// Add user to database
		try {
			userIds = await userModel.add(user);
		} catch (err) {
			if (err.sqlState === '23000') {
				return res.status(httpStatus.CONFLICT).send(DB_QUERY_ERROR);
			}
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}

		// Generate tokens
		const verifyTokenPayload = {
			userId: userIds[0],
		};

		const verifyToken = jwt.sign(verifyTokenPayload, process.env.SECRET_KEY, optsVerify);

		// Mail option
		let mailOptions = {
			from: 'norely@gmail.com',
			to: user.email,
			subject: 'Verify token',
			text: `Link verify token : ${process.env.URL_FRONTEND}/verify?token=${verifyToken}`,
		};
		sendEmail(mailOptions);

		getIO().emit(AUTH_REGISTER, null);

		return res.status(httpStatus.NO_CONTENT).send();
	},

	verify: async (req, res) => {
		const { token } = req.body;

		let _userId = -1;

		// Verify token
		try {
			const { userId } = jwt.verify(token, process.env.SECRET_KEY, optsVerify);
			_userId = userId;
		} catch (err) {
			if (err.name === 'TokenExpiredError') return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN);
			return res.status(httpStatus.UNAUTHORIZED).send(INVALID_VERIFYTOKEN);
		}

		// Update account status
		try {
			await userModel.patch(_userId, {
				is_active: true,
			});
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	resent: async (req, res) => {
		const { email } = req.body;

		let _userId = -1;

		// Check if email existed in db
		try {
			const user = await userModel.findByEmail(email);
			if (user === null) {
				return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
			}
			_userId = user.user_id;
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}

		// Generate tokens
		const verifyTokenPayload = {
			userId: _userId,
		};

		const verifyToken = jwt.sign(verifyTokenPayload, process.env.SECRET_KEY, optsVerify);

		// Mail option
		let mailOptions = {
			from: 'norely@gmail.com',
			to: email,
			subject: 'Verify token',
			text: `Link verify token : ${process.env.URL_FRONTEND}/verify?token=${verifyToken}`,
		};

		sendEmail(mailOptions);

		return res.status(httpStatus.NO_CONTENT).send();
	},

	login: async (req, res) => {
		try {
			// Find user by email
			const user = await userModel.findByEmail(req.body.email);
			if (user === null) {
				return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR);
			}

			// Check if account is active
			if (!user.is_active) {
				return res.status(httpStatus.UNAUTHORIZED).send(ACCOUNT_NOT_ACTIVE);
			}

			// Check password
			if (!bcrypt.compareSync(req.body.password, user.password)) {
				return res.status(httpStatus.UNAUTHORIZED).send(LOGIN_ERROR);
			}

			// Generate tokens
			const accessTokenPayload = {
				userId: user.user_id,
				userRole: user.role,
			};
			const refreshTokenPayload = {
				userId: user.user_id,
				userRole: user.role,
				userPassHash: user.password.substring(0, 10),
			};

			const accessToken = jwt.sign(accessTokenPayload, process.env.SECRET_KEY, optsAccess);
			const refreshToken = jwt.sign(refreshTokenPayload, process.env.SECRET_KEY);

			return res.status(httpStatus.OK).send({
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}
	},

	refresh: async (req, res) => {
		let { refresh_token } = req.body;

		let _userId = -1;
		let _userRole = -1;

		// Check if refresh token is valid
		try {
			let { userId, userRole, userPassHash } = jwt.verify(refresh_token, process.env.SECRET_KEY);
			_userId = userId;
			_userRole = userRole;
			let user = await userModel.findById(userId);
			if (userPassHash !== user.password.substring(0, 10)) {
				return res.status(httpStatus.UNAUTHORIZED).send(INVALID_REFRESHTOKEN);
			}
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_REFRESHTOKEN);
			}
			return res.status(httpStatus.UNAUTHORIZED).send(INVALID_REFRESHTOKEN);
		}

		// Check if revoked
		try {
			let data = await redisClient.get(refresh_token);
			if (data !== null) {
				return res.status(httpStatus.UNAUTHORIZED).send(INVALID_REFRESHTOKEN);
			}
		} catch (err) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}

		// Create new access token
		const accessTokenPayload = {
			userId: _userId,
			userRole: _userRole,
		};
		const newAccessToken = jwt.sign(accessTokenPayload, process.env.SECRET_KEY, optsAccess);

		return res.status(httpStatus.OK).send({
			access_token: newAccessToken,
			refresh_token: refresh_token,
		});
	},

	logout: async (req, res) => {
		const { access_token, refresh_token } = req.body;
		const opts = {
			ignoreExpiration: true,
		};
		try {
			const isInt = (value) => {
				return (
					!isNaN(value) &&
					(function (x) {
						return (x | 0) === x;
					})(parseFloat(value))
				);
			};

			// Validate and revoke tokens
			jwt.verify(access_token, process.env.SECRET_KEY, opts, async function (err, decode) {
				if (err) throw err;
				let expiresIn = decode.exp * 1000 - new Date().getTime();
				expiresIn = Math.floor(expiresIn / 1000);
				try {
					if (expiresIn > 0) await redisClient.setEx(access_token, expiresIn, '0');
				} catch (err) {
					throw err;
				}
			});

			jwt.verify(refresh_token, process.env.SECRET_KEY, async function (err, decode) {
				if (err) throw err;
				let expiresIn = decode.exp * 1000 - new Date().getTime();
				expiresIn = Math.floor(expiresIn / 1000);
				try {
					if (expiresIn > 0) await redisClient.setEx(refresh_token, expiresIn, '0');
				} catch (err) {
					throw err;
				}
			});
			return res.status(httpStatus.NO_CONTENT).send();
		} catch (err) {
			return res.status(httpStatus.UNAUTHORIZED).send(INVALID_TOKEN);
		}
	},

	resetByEmail: async (req, res) => {
		const { email } = req.body;
		const user = await userModel.findByEmail(email);

		// Check user exist
		if (user === null) {
			return res.status(httpStatus.NOT_FOUND).send(NOT_FOUND_USER);
		}

		// Create verify token
		const payloadVerifyToken = {
			userId: user.user_id,
		};

		const verifyToken = jwt.sign(payloadVerifyToken, process.env.SECRET_KEY, optsVerify);

		// TODO: Move this to rmq
		let mailOptions = {
			from: 'norely@gmail.com',
			to: email,
			subject: 'Reset pass token',
			text: `Link reset pass token : ${process.env.URL_FRONTEND}/reset?token=${verifyToken}`,
		};
		// send email to yser
		sendEmail(mailOptions);

		return res.status(httpStatus.NO_CONTENT).send();
	},

	resetPass: async (req, res) => {
		let { password, token } = req.body;

		password = bcrypt.hashSync(password, 10);
		var _userId = -1;

		// Get userId and check jwt
		try {
			const { userId } = jwt.verify(token, process.env.SECRET_KEY, optsVerify);
			_userId = userId;
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				return res.status(httpStatus.UNAUTHORIZED).send(EXPIRED_VERIFYTOKEN);
			}
			return res.status(httpStatus.UNAUTHORIZED).send(INVALID_VERIFYTOKEN);
		}

		try {
			await userModel.patch(_userId, {
				password: password,
			});
		} catch (err) {
			res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
		}

		return res.status(httpStatus.NO_CONTENT).send();
	},
};
