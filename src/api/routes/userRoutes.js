const router = require('express').Router();
import { UserController } from '../controllers';
import validate from '../middlewares/validate.js';
import { schema as updateRoleSchema } from '../schemas/updateRole';
import { schema as upgrageSellerRequestSchema } from '../schemas/upgrageSellerRequest';
import { schema as rateSchema } from '../schemas/rate';
import { schema as watchSchema } from '../schemas/watch';
import { schema as sendNewEmailSchema } from '../schemas/sendNewEmail';
import { schema as updateUserSchema } from '../schemas/updateUser';
import { schema as updateUserAdminSchema } from '../schemas/updateUserAdmin';
import { schema as registerUserAdminSchema } from '../schemas/registerAdmin';
import isPermittedToUser from '../middlewares/isPermittedToUser';

router.get('/:id', isPermittedToUser, UserController.getUser);
router.put('/:id', isPermittedToUser, validate(updateUserSchema), UserController.updateUser);
router.get('/:id/bidding', isPermittedToUser, UserController.getAllBidding);
router.post('/:id/email', isPermittedToUser, validate(sendNewEmailSchema), UserController.sendNewEmail); // send token to new email

// admin
router.get('/all', UserController.getAllUser);
router.post('/user', validate(registerUserAdminSchema), UserController.addUserAdmin);
router.put('/user/:id', validate(updateUserAdminSchema), UserController.updateUserAdmin);
router.delete('/user/:id', UserController.deleteUserAdmin);

router.put('/role', validate(updateRoleSchema), UserController.updateRole);
router.get('/requestSeller', UserController.getAllRequestSeller);

// request to be seller
router.post('/requestSeller', validate(upgrageSellerRequestSchema), UserController.sendUpgrageSellerRequest);

// rate
router.get('/rate', UserController.getAllRate);
router.get('/productCanRate', UserController.getAllProductNotRate); // all product user can rate but no rate
router.post('/rate', validate(rateSchema), UserController.postRate);

// watchlist
router.get('/watchlist', UserController.getWatchList);
router.post('/watchlist', validate(watchSchema), UserController.addWatch);
router.delete('/watchlist', validate(watchSchema), UserController.deleteWatch);

export default router;
