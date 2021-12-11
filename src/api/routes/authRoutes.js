const router = require('express').Router();
import { authModel } from '../models';
import validate from '../middlewares/validate.js';
import validateQuery from '../middlewares/validateQuery.js';
import {schema as loginSchema} from '../schema/login.js'
import {schema as refreshSchema} from '../schema/refresh.js'
import {schema as resetPassSchema} from '../schema/resetPass.js'
import {schema as registerSchema} from '../schema/register.js'
import {schema as verifySchema} from '../schema/verifyAccount.js'

router.post('/', validate(loginSchema), authModel.login);
router.post('/refresh',validate(refreshSchema), authModel.refresh);
router.delete('/logout',validate(refreshSchema), authModel.logout)

router.post('/reset', authModel.resetByEmail)
router.put('/reset',validate(resetPassSchema), authModel.resetPass)

router.post('/register',validate(registerSchema), authModel.register)
router.post('/verify',validateQuery(verifySchema), authModel.verify)

export default router;