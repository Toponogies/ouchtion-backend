const router = require('express').Router();
import biddingController from '../controllers/biddingController.js';
import validate from '../middlewares/validate.js';
import {schema as biddingSchema} from '../schema/bidding';
import {schema as autobiddingSchema} from '../schema/autoBidding';
import {schema as biddingRequestSchema} from '../schema/biddingRequest';
import {schema as biddingRequestPostSchema} from '../schema/biddingRequestPost';
import {schema as biddingPermissionSchema} from '../schema/biddingPermission';

router.post('/',validate(biddingSchema), biddingController.addBidding) // create a bididng
router.post('/autoBidding', validate(autobiddingSchema), biddingController.addAutoBidding) // create a auto bididng
router.delete('/bidding/:id', biddingController.rejectBidding)

router.get('/biddingRequest', biddingController.getBiddingRequests) // seller get all bidding request
router.post('/biddingRequest', validate(biddingRequestPostSchema), biddingController.addBiddingRequest) // bidder send bidding request to seller
router.put('/biddingRequest', validate(biddingPermissionSchema), biddingController.permissionBidding) // allow bidding or deny bidding
router.delete('/biddingRequest', validate(biddingRequestSchema), biddingController.notAllowBidding) // not allow bidding permission

export default router;