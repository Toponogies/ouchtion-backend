import httpStatus from 'http-status-codes';
import { NOTFOUND_ERROR, UNEXPECTED_ERROR } from '../helpers/constants/errors';
const router = require('express').Router();

router.use((req, res) => {
	res.status(httpStatus.NOT_FOUND).send(NOTFOUND_ERROR);
});

// eslint-disable-next-line no-unused-vars
router.use(function (err, req, res, _next) {
	console.log(err.stack);
	return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
});

export default router;
