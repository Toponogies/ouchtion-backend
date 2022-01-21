const router = require('express').Router();
import { UserController } from '../controllers';
import validate from '../middlewares/validateQuery.js';
import { VerifySchema } from '../schemas';

router.get('/:id/point', UserController.getPoint);
router.put('/email', validate(VerifySchema), UserController.updateEmail); // update email

export default router;
