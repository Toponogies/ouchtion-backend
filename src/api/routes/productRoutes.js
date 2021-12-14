const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery.js';
import {schema as productPostSchema} from '../schema/productPost'
import {schema as productSellerSchema} from '../schema/productSellerId'
import {schema as productUpdateSchema} from '../schema/productUpdate'
import {schema as productDescriptionSchema} from '../schema/productDescription'
import {schema as productDescriptionUpdateSchema} from '../schema/productDescriptionUpdate'

router.get('/', productController.getAllProduct);
router.post('/',validate(productPostSchema), productController.addProduct);
router.get('/seller',validate(productSellerSchema),productController.getAllProductBySellerId);
router.get('/:id',productController.getProduct);
router.put('/:id',validate(productUpdateSchema),productController.updateProduct);
router.delete('/:id',productController.deleteProduct);

// upload type multipart/form
router.post('/:id/avatar',productController.uploadAvatar);
router.post('/:id/image',productController.uploadImage);

// description
router.post('/:id/description', validate(productDescriptionSchema),productController.addDescription);

export default router;