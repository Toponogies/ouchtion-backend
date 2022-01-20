const router = require('express').Router();
import { UserController } from '../controllers';
import validate from '../middlewares/validate.js';
import { schema as updateRoleSchema } from '../schemas/updateRole';
import { schema as upgrageSellerRequestSchema } from '../schemas/upgrageSellerRequest';
import { schema as rateSchema } from '../schemas/rate';
import { schema as sendNewEmailSchema } from '../schemas/sendNewEmail';
import { schema as updateUserSchema } from '../schemas/updateUser';
import { schema as registerUserAdminSchema } from '../schemas/registerAdmin';
import isPermittedToUser from '../middlewares/isPermittedToUser';
import isAdmin from '../middlewares/isAdmin';
import isBidder from '../middlewares/isBidder';

// User management for user and admin
router.get('/:id', isPermittedToUser, UserController.getUser);
router.put('/:id', isPermittedToUser, validate(updateUserSchema), UserController.updateUser);

// Per user
router.post('/email', validate(sendNewEmailSchema), UserController.sendNewEmail); // send token to new email

// Per bidder
router.post('/requestSeller', isBidder, validate(upgrageSellerRequestSchema), UserController.sendUpgrageSellerRequest);

// Per admin
router.get('/', isAdmin, UserController.getUsers);
router.post('/', isAdmin, validate(registerUserAdminSchema), UserController.addUser);
router.delete('/:id', isAdmin, UserController.deleteUser);
router.put('/role', isAdmin, validate(updateRoleSchema), UserController.updateRole);
router.get('/request', isAdmin, UserController.getAllRequest);

// rate
router.get('/rate', UserController.getAllRate);
router.post('/rate', validate(rateSchema), UserController.postRate);

// TODO: Remove this
router.get('/productCanRate', UserController.getAllProductNotRate); // all product user can rate but no rate

export default router;
