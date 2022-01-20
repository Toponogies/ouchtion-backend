const router = require('express').Router();
import { CategoryController } from '../controllers';

router.get('/', CategoryController.getCategories);

export default router;
