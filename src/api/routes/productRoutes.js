const router = require('express').Router();
import { ProductController } from '../controllers';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery';
import { WatchSchema, ProductUpdateSchema, ProductPostSchema, ProductDescriptionSchema, ProductSearchSchema } from '../schemas';
import { uploadAvatar, uploadImage } from '../helpers/constants/multer.js';
import isBidder from '../middlewares/isBidder';
import isSeller from '../middlewares/isSeller';
import isAdmin from '../middlewares/isSeller';
import isProductOwner from '../middlewares/isProductOwner.js';

// Per seller
// upload type multipart/form
router.post('/:id/images', isSeller, isProductOwner, uploadImage.single('image'), ProductController.uploadImage);
router.post('/', isSeller, uploadAvatar.single('avatar'), validate(ProductPostSchema), ProductController.addProduct);
router.put(
	'/:id',
	isSeller,
	isProductOwner,
	uploadAvatar.single('avatar'),
	validate(ProductUpdateSchema),
	ProductController.updateProduct
);

// json type
router.post('/:id/descriptions', isSeller, isProductOwner, validate(ProductDescriptionSchema), ProductController.addDescription);
router.delete('/:id/descriptions/:descriptionId', isSeller, isProductOwner, ProductController.deleteDescription);
router.delete('/:id/images/:imageId', isSeller, isProductOwner, ProductController.deleteImage);

// Per admin
router.get('/admin/products', isAdmin, validateQuery(ProductSearchSchema), ProductController.getProductsForAdmin);
router.delete('/:id', isAdmin, ProductController.deleteProduct);

// Per bidder
router.get('/bidders/ongoingBids', isBidder, ProductController.getBiddingProducts);
router.get('/bidders/completedBids', isBidder, ProductController.getHasWonProducts);
router.get('/bidders/watchlist', isBidder, ProductController.getWatchList);
router.post('/bidders/watchlist', isBidder, validate(WatchSchema), ProductController.addWatch);
router.delete('/biddlers/watchlist', isBidder, validate(WatchSchema), ProductController.deleteWatch);

// Per seller
router.get('/sellers/ongoingProducts', isSeller, ProductController.productsActive);
router.get('/sellers/finishedProducts', isSeller, ProductController.productsInActive);

export default router;
