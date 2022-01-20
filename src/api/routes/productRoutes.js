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

// upload type multipart/form
router.post('/:id/image', uploadImage.single('image'), ProductController.uploadImage);
router.post('/', uploadAvatar.single('avatar'), validate(productPostSchema), ProductController.addProduct);
router.put('/:id', uploadAvatar.single('avatar'), validate(productUpdateSchema), ProductController.updateProduct);

// json type
router.delete('/:id', ProductController.deleteProduct);
router.post('/:id/description', validate(productDescriptionSchema), ProductController.addDescription);
router.delete('/:id/description/:descriptionId', ProductController.deleteDescription);
router.delete('/:id/image/:imageId', ProductController.deleteImage);

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
