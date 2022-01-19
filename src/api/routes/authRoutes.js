const router = require('express').Router();
import { AuthController } from '../controllers';
import validate from '../middlewares/validate.js';
import {
	LoginSchema,
	RefreshSchema,
	ResetPasswordSchema,
	RegisterSchema,
	VerifySchema,
	ResentSchema,
	LogoutSchema,
	ResetPasswordEmailSchema,
} from '../schemas';

router.post('/', validate(LoginSchema), AuthController.login);
router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/verify', validate(VerifySchema), AuthController.verify);
router.post('/resent', validate(ResentSchema), AuthController.resent);
router.delete('/logout', validate(LogoutSchema), AuthController.logout);
router.post('/refresh', validate(RefreshSchema), AuthController.refresh);
router.post('/reset', validate(ResetPasswordEmailSchema), AuthController.resetByEmail);
router.put('/reset', validate(ResetPasswordSchema), AuthController.resetPass);

export default router;
