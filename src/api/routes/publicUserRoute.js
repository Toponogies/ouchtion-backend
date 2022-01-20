const router = require('express').Router();
import { UserController } from '../controllers';
import validateQuery from '../middlewares/validateQuery.js';
import { UpdateEmailSchema } from '../schemas';

router.get('/:id/point', UserController.getPoint);
router.put('/email', validateQuery(UpdateEmailSchema), UserController.updateEmail); // update email

export default router;
