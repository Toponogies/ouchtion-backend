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
	ChangePasswordSchema,
} from '../schemas';
import isPermittedToUser from '../middlewares/isPermittedToUser';
import isAdmin from '../middlewares/isAdmin';
import isBidder from '../middlewares/isBidder';

// User management for user and admin
router.get('/:id', isPermittedToUser, UserController.getUser);
router.put('/:id', isPermittedToUser, validate(UpdateUserSchema), UserController.updateUser);
router.put('/:id/changePassword', isPermittedToUser, validate(ChangePasswordSchema), UserController.changePassword);
router.post('/:id/email', validate(SendNewEmailSchema), UserController.sendNewEmail); // send token to new email

// Per bidder
router.post('/requestSeller', isBidder, validate(UpgradeSellerRequestSchema), UserController.sendUpgrageSellerRequest);

// Per admin
router.get('/', isAdmin, UserController.getUsers);
router.post('/', isAdmin, validate(RegisterAdminSchema), UserController.addUser);
router.delete('/:id', isAdmin, UserController.deleteUser);
router.put('/admin/role', isAdmin, validate(UpdateRoleSchema), UserController.updateRole);
router.get('/admin/request', isAdmin, UserController.getAllRequest);
router.delete('/admin/request/:id', isAdmin, UserController.rejectRequest);

// rate
router.get('/rate', UserController.getAllRate);
router.post('/rate', validate(RateSchema), UserController.postRate);

// TODO: Remove this
router.get('/productCanRate', UserController.getAllProductNotRate); // all product user can rate but no rate

export default router;
