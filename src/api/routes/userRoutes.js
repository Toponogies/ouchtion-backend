const router = require('express').Router();
import userController from '../controllers/userController.js';
import validate from '../middlewares/validate.js';
import {schema as updateRoleSchema} from '../schema/updateRole';
import {schema as upgrageSellerRequestSchema} from '../schema/upgrageSellerRequest';
import {schema as rateSchema} from '../schema/rate';
import {schema as watchSchema} from '../schema/watch';
import {schema as sendNewEmailSchema} from '../schema/sendNewEmail';
import {schema as updateUserSchema} from '../schema/updateUser';
import {schema as updateUserAdminSchema} from '../schema/updateUserAdmin';
import {schema as registerUserAdminSchema} from '../schema/registerAdmin';

router.get('/', userController.getUser);
router.get('/bidding', userController.getAllBidding);
router.put('/',validate(updateUserSchema), userController.updateUser);
router.post('/email',validate(sendNewEmailSchema), userController.sendNewEmail); // send token to new email

// admin
router.get('/all', userController.getAllUser);
router.post('/user',validate(registerUserAdminSchema) , userController.addUserAdmin);
router.put('/user/:id',validate(updateUserAdminSchema), userController.updateUserAdmin);
router.delete('/user/:id', userController.deleteUserAdmin);

router.put('/role',validate(updateRoleSchema), userController.updateRole);
router.get('/requestSeller', userController.getAllRequestSeller);

// request to be seller
router.post('/requestSeller', validate(upgrageSellerRequestSchema), userController.sendUpgrageSellerRequest);

// rate
router.get('/rate', userController.getAllRate);
router.get('/productCanRate', userController.getAllProductNotRate); // all product user can rate but no rate
router.post('/rate',validate(rateSchema), userController.postRate);

// watchlist
router.get('/watchlist', userController.getWatchList);
router.post('/watchlist',validate(watchSchema), userController.addWatch);
router.delete('/watchlist',validate(watchSchema), userController.deleteWatch);

export default router;