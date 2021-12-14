import httpStatus from 'http-status-codes';
import { NOTFOUND_ERROR, UNEXPECTED_ERROR } from '../helpers/constants/Errors';
const router = require('express').Router();

router.use((req, res) => {
    res.status(httpStatus.NOT_FOUND).send(NOTFOUND_ERROR);
});

router.use(function (err, req, res, next) {
    console.log(err.stack);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
});

export default router;