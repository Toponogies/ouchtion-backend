const router = require('express').Router();
import { authModel } from '../models';

router.post('/', authModel.login);
router.post('/refresh', authModel.refresh);
router.delete('/logout', authModel.logout)

router.post('/reset', authModel.resetByEmail)
router.put('/reset', authModel.resetPass)

router.post('/register', authModel.register)
router.post('/verify', authModel.verify)

export default router;