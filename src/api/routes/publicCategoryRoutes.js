const router = require('express').Router();
import { CategoryController } from '../controllers';

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
export default router;
