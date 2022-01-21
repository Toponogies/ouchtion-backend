const router = require('express').Router();
import biddingController from '../controllers/biddingController.js';
import validate from '../middlewares/validate.js';
import {
	BiddingSchema,
	AutoBiddingSchema,
	BuyProductSchema,
	BiddingRequestPostSchema,
	BiddingPermissionSchema,
	BiddingRequestSchema,
} from '../schemas';
import isBidder from '../middlewares/isBidder.js';
import isSeller from '../middlewares/isSeller.js';

// Per bidder
router.post('/', isBidder, validate(BiddingSchema), biddingController.addBidding);
router.post('/autoBidding', isBidder, validate(AutoBiddingSchema), biddingController.addAutoBidding);
router.delete('/autoBidding/:id', biddingController.disableAutoBidding);
router.post('/buyProduct', isBidder, validate(BuyProductSchema), biddingController.buyNowProduct);
router.post('/biddingRequest', isBidder, validate(BiddingRequestPostSchema), biddingController.addBiddingRequest);

// Per seller
router.delete('/rejectBidding/:id', isSeller, biddingController.rejectBidding);
router.get('/biddingRequest', isSeller, biddingController.getBiddingRequests);
router.delete('/biddingRequest', isSeller, validate(BiddingRequestSchema), biddingController.notAllowBidding);

router.post('/biddingPermission', isSeller, biddingController.getBiddingPermissionProduct);
router.put('/biddingPermission', isSeller, validate(BiddingPermissionSchema), biddingController.permissionBidding);

export default router;
