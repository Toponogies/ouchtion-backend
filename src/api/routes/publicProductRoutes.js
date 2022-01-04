const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery';
import {schema as productSellerSchema} from '../schema/productSellerId';
import {schema as productSearchSchema} from '../schema/productSearch';

router.get('/',validateQuery(productSearchSchema), productController.searchProduct);
router.post('/seller',validate(productSellerSchema),productController.getAllProductBySellerId);
router.get('/:id',productController.getProduct);
router.get('/:id/image',productController.getImages);
router.get('/:id/description',productController.getDescriptions);
router.get('/:id/bidding',productController.getAllBidding);

export default router;