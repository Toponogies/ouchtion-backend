const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import {schema as productSellerSchema} from '../schema/productSellerId'

router.get('/', productController.getAllProduct);
router.get('/seller',validate(productSellerSchema),productController.getAllProductBySellerId);
router.get('/:id',productController.getProduct);

export default router;