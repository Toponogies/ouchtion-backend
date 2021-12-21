const router = require('express').Router();
import { AuthController } from '../controllers';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery.js';
import {schema as loginSchema} from '../schema/login.js'
import {schema as refreshSchema} from '../schema/refresh.js'
import {schema as resetPassSchema} from '../schema/resetPass.js'
import {schema as registerSchema} from '../schema/register.js'
import {schema as verifySchema} from '../schema/verifyAccount.js'

router.post('/', validate(loginSchema), AuthController.login);
router.post('/refresh',validate(refreshSchema), AuthController.refresh);
router.delete('/logout',validate(refreshSchema), AuthController.logout)

router.post('/reset', AuthController.resetByEmail)
router.put('/reset',validate(resetPassSchema), AuthController.resetPass)

router.post('/register',validate(registerSchema), AuthController.register)
router.post('/verify',validateQuery(verifySchema), AuthController.verify)

export default router;