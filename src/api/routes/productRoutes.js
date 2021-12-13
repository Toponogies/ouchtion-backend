const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery.js';

router.get('/', productController.getAllProduct);
router.get('/user',productController.getAllProductBySellerId);
router.get('/:id',productController.getProduct);
router.put('/:id',productController.updateProduct);
router.delete('/:id',productController.deleteProduct);
router.post('/:id/avatar',productController.uploadAvatar);

export default router;