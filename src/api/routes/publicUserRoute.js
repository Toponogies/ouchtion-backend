const router = require('express').Router();
import userController from '../controllers/userController.js';

router.get('/:id/point', userController.getPoint);

export default router;