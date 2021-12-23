const router = require('express').Router();
import validate from '../middlewares/validate.js';
import {schema as categorySchema} from '../schema/category'
import auth from '../middlewares/auth'
import categoryController from '../controllers/categoryController.js';

router.get('/', categoryController.getAllCategory)
router.get('/:id/childcategory' , categoryController.getAllChildCategory)

// only admin can use
router.post('/',auth ,validate(categorySchema), categoryController.addCategory)
router.delete('/:id',auth, categoryController.deleteCategory)

export default router;