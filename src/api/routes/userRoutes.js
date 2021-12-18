const router = require('express').Router();
import userController from '../controllers/userController.js';
import validate from '../middlewares/validate.js';

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

router.get('/:id/rate', userController.getAllRate);
router.get('/:id/notRate', userController.getAllProductNotRate);
router.post('/:id/rate', userController.postRate);

router.get('/:id/watchlist', userController.getWatchList);
router.post('/:id/watchlist', userController.addWatch);
router.delete('/:id/watchlist', userController.deleteWatch);

router.get('/:id/bidding', userController.getAllBidding);

export default router;