const router = require('express').Router();
import { UserController } from '../controllers';
import validate from '../middlewares/validate';
import { VerifySchema } from '../schemas';

router.get('/:id/point', UserController.getPoint);
router.put('/user/email', validate(VerifySchema), UserController.updateEmail); // update email

export default router;
