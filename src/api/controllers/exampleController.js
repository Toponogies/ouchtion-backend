import httpStatus from 'http-status-codes';
import { UNEXPECTED_ERROR } from '../helpers/constants/Errors';
import { ExampleService } from '../services';

export default {
    getExamples: async (req, res) => {
        try {
            let examples = await ExampleService.getExamples();
            res.status(httpStatus.OK).send(examples);
        } catch (error) {
            // Handle error based on error type
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(UNEXPECTED_ERROR);
        }
    },
};
