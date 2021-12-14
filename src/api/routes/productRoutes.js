const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery.js';
import {schema as productPostSchema} from '../schema/productPost'
import {schema as productSellerSchema} from '../schema/productSellerId'
import {schema as productUpdateSchema} from '../schema/productUpdate'

router.get('/', productController.getAllProduct);
router.post('/',validate(productPostSchema), productController.addProduct);
router.get('/seller',validate(productSellerSchema),productController.getAllProductBySellerId);
router.get('/:id',productController.getProduct);
router.put('/:id',validate(productUpdateSchema),productController.updateProduct);
router.delete('/:id',productController.deleteProduct);

router.post('/:id/avatar',productController.uploadAvatar);

router.post('/:id/image',productController.uploadImage);
router.post('/:id/description',productController.uploadDescription);

export default router;