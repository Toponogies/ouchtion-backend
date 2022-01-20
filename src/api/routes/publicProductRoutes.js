const router = require('express').Router();
import { ProductController } from '../controllers';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery';
import { ProductSearchSchema, ProductSellerSchema } from '../schemas';

router.get('/', validateQuery(ProductSearchSchema), ProductController.searchProduct);
router.get('/:id', ProductController.getProduct);
router.get('/:id/images', ProductController.getImages);
router.get('/:id/descriptions', ProductController.getDescriptions);
router.get('/:id/biddings', ProductController.getAllBidding);

// TODO: may remove this
router.post('/seller', validate(ProductSellerSchema), ProductController.getAllProductBySellerId);

export default router;
