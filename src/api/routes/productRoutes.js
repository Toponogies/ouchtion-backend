const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import {schema as productUpdateSchema} from '../schemas/productUpdate';
import {schema as productDescriptionSchema} from '../schemas/productDescription';
import {schema as productPostSchema} from '../schemas/productPost';
import { uploadAvatar, uploadImage } from '../helpers/constants/multer.js';

// upload type multipart/form
router.post('/:id/image',uploadImage.single('image'),productController.uploadImage);
router.post('/',uploadAvatar.single('avatar'),validate(productPostSchema), productController.addProduct);
router.put('/:id',uploadAvatar.single('avatar'),validate(productUpdateSchema),productController.updateProduct);

// json type
router.delete('/:id',productController.deleteProduct);
router.post('/:id/description', validate(productDescriptionSchema),productController.addDescription);
router.delete('/:id/description/:descriptionId',productController.deleteDescription);
router.delete('/:id/image/:imageId',productController.deleteImage);

router.get('/won',productController.productsWon);
router.get('/bidding',productController.productsBidding);
router.get('/active',productController.productsActive);
router.get('/inactive',productController.productsInActive);


export default router;