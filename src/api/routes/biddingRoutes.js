const router = require('express').Router();
import biddingController from '../controllers/biddingController.js';
import validate from '../middlewares/validate.js';
import {schema as biddingSchema} from '../schemas/bidding';
import {schema as autobiddingSchema} from '../schemas/autoBidding';
import {schema as biddingRequestSchema} from '../schemas/biddingRequest';
import {schema as biddingRequestPostSchema} from '../schemas/biddingRequestPost';
import {schema as biddingPermissionSchema} from '../schemas/biddingPermission';
import {schema as buyProductSchema} from '../schemas/buyProduct';

router.post('/',validate(biddingSchema), biddingController.addBidding); // create a bididng
router.post('/autoBidding', validate(autobiddingSchema), biddingController.addAutoBidding); // create a auto bididng
router.delete('/autoBidding/:id', biddingController.disableAutoBidding); // disable a auto bididng
router.delete('/rejectBidding/:id', biddingController.rejectBidding);
router.post('/buyProduct', validate(buyProductSchema), biddingController.buyNowProduct); // buy product

router.get('/biddingRequest', biddingController.getBiddingRequests); // seller get all bidding request
router.post('/biddingRequest', validate(biddingRequestPostSchema), biddingController.addBiddingRequest); // bidder send bidding request to seller
router.delete('/biddingRequest', validate(biddingRequestSchema), biddingController.notAllowBidding); // not allow bidding permission

router.post('/biddingPermission', biddingController.getBiddingPermissionProduct); // get all bidding permission of one product
router.put('/biddingPermission', validate(biddingPermissionSchema), biddingController.permissionBidding); // allow bidding or deny bidding

export default router;