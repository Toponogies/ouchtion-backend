const router = require('express').Router();
import userController from '../controllers/userController.js';
import validateQuery from '../middlewares/validateQuery.js';
import {schema as updateEmailSchema} from '../schema/updateEmail';

router.get('/:id/point', userController.getPoint);
router.put('/email',validateQuery(updateEmailSchema), userController.updateEmail); // update email

export default router;