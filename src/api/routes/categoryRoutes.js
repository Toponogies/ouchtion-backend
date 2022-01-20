const router = require('express').Router();
import validate from '../middlewares/validate.js';
import { CategorySchema } from '../schemas';
import isAdmin from '../middlewares/isAdmin';
import { CategoryController } from '../controllers';

router.post('/', isAdmin, validate(CategorySchema), CategoryController.addCategory);
router.put('/:id', isAdmin, validate(CategorySchema), CategoryController.updateCategory);
router.delete('/:id', isAdmin, CategoryController.deleteCategory);

export default router;
