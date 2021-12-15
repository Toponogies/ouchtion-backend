const router = require('express').Router();
import productController from '../controllers/productController.js';
import validate from '../middlewares/validate.js';
import {schema as productUpdateSchema} from '../schema/productUpdate'
import {schema as productDescriptionSchema} from '../schema/productDescription'
import {schema as productPostSchema} from '../schema/productPost'

router.post('/',validate(productPostSchema), productController.addProduct);
router.put('/:id',validate(productUpdateSchema),productController.updateProduct);
router.delete('/:id',productController.deleteProduct);

// upload type multipart/form
router.post('/:id/avatar',productController.uploadAvatar);
router.post('/:id/image',productController.uploadImage);

router.post('/:id/description', validate(productDescriptionSchema),productController.addDescription);
router.delete('/:id/description/:descriptionId',productController.deleteDescription);
router.delete('/:id/image/:imageId',productController.deleteImage);


export default router;