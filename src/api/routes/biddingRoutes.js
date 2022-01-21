const router = require('express').Router();
import { BiddingController } from '../controllers';
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
import isPermittedToBid from '../middlewares/isPermittedToBid';

// Per bidder
router.post('/', isBidder, isPermittedToBid, validate(BiddingSchema), BiddingController.addBidding);
router.post('/autoBidding', isBidder, isPermittedToBid, validate(AutoBiddingSchema), BiddingController.addAutoBidding);

// TODO: what if it is banned
router.delete('/autoBidding/:id', BiddingController.disableAutoBidding);

router.post('/buyProduct', isBidder, validate(BuyProductSchema), BiddingController.buyNowProduct);
router.post('/bidders/biddingRequest', isBidder, validate(BiddingRequestPostSchema), BiddingController.addBiddingRequest);
router.get('/bidders/biddingPermission', isBidder, validate(BiddingRequestPostSchema), BiddingController.getPermission);

// Per seller
router.delete('/rejectBidding/:id', isSeller, BiddingController.rejectBidding);
router.get('/sellers/biddingRequest', isSeller, BiddingController.getBiddingRequests);
router.delete('/sellers/biddingRequest', isSeller, validate(BiddingRequestSchema), BiddingController.notAllowBidding);

router.post('/sellers/biddingPermission', isSeller, BiddingController.getBiddingPermissionProduct);
router.put('/sellers/biddingPermission', isSeller, validate(BiddingPermissionSchema), BiddingController.permissionBidding);

export default router;
