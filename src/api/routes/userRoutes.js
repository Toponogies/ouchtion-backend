const router = require('express').Router();
import { UserController } from '../controllers';
import validate from '../middlewares/validate.js';
import {
	UpdateUserSchema,
	SendNewEmailSchema,
	UpgradeSellerRequestSchema,
	RegisterAdminSchema,
	UpdateRoleSchema,
	RateSchema,
} from '../schemas';
import isPermittedToUser from '../middlewares/isPermittedToUser';
import isAdmin from '../middlewares/isAdmin';
import isBidder from '../middlewares/isBidder';

// User management for user and admin
router.get('/:id', isPermittedToUser, UserController.getUser);
router.put('/:id', isPermittedToUser, validate(UpdateUserSchema), UserController.updateUser);

// Per user
router.post('/email', validate(SendNewEmailSchema), UserController.sendNewEmail); // send token to new email

// Per bidder
router.post('/requestSeller', isBidder, validate(UpgradeSellerRequestSchema), UserController.sendUpgrageSellerRequest);

// Per admin
router.get('/', isAdmin, UserController.getUsers);
router.post('/', isAdmin, validate(RegisterAdminSchema), UserController.addUser);
router.delete('/:id', isAdmin, UserController.deleteUser);
router.put('/role', isAdmin, validate(UpdateRoleSchema), UserController.updateRole);
router.get('/request', isAdmin, UserController.getAllRequest);

// rate
router.get('/rate', UserController.getAllRate);
router.post('/rate', validate(RateSchema), UserController.postRate);

// TODO: Remove this
router.get('/productCanRate', UserController.getAllProductNotRate); // all product user can rate but no rate

export default router;
