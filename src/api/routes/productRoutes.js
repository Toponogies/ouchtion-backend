const router = require('express').Router();
import { ProductController } from '../controllers';
import validate from '../middlewares/validate.js';
import { schema as productUpdateSchema } from '../schemas/productUpdate';
import { schema as productDescriptionSchema } from '../schemas/productDescription';
import { schema as productPostSchema } from '../schemas/productPost';
import { schema as watchSchema } from '../schemas/watch';
import { uploadAvatar, uploadImage } from '../helpers/constants/multer.js';
import isBidder from '../middlewares/isBidder';
import isSeller from '../middlewares/isSeller';
import isAdmin from '../middlewares/isSeller';
import isProductOwner from '../middlewares/isProductOwner.js';

// Per seller
// upload type multipart/form
router.post('/:id/image', isSeller, isProductOwner, uploadImage.single('image'), ProductController.uploadImage);
router.post('/', isSeller, uploadAvatar.single('avatar'), validate(productPostSchema), ProductController.addProduct);
router.put(
	'/:id',
	isSeller,
	isProductOwner,
	uploadAvatar.single('avatar'),
	validate(productUpdateSchema),
	ProductController.updateProduct
);

// json type
router.post('/:id/description', isSeller, isProductOwner, validate(productDescriptionSchema), ProductController.addDescription);
router.delete('/:id/description/:descriptionId', isSeller, isProductOwner, ProductController.deleteDescription);
router.delete('/:id/image/:imageId', isSeller, isProductOwner, ProductController.deleteImage);

// Per admin
router.delete('/:id', isAdmin, ProductController.deleteProduct);

// Per bidder
router.get('/ongoingBids', isBidder, ProductController.getBiddingProducts);
router.get('/completedBids', isBidder, ProductController.getHasWonProducts);
router.get('/watchlist', isBidder, ProductController.getWatchList);
router.post('/watchlist', isBidder, validate(watchSchema), ProductController.addWatch);
router.delete('/watchlist', isBidder, validate(watchSchema), ProductController.deleteWatch);

// Per seller
router.get('/ongoingProducts', isSeller, ProductController.productsActive);
router.get('/soldProducts', isSeller, ProductController.productsInActive);

export default router;
