import Ajv from 'ajv';
import httpStatus from 'http-status-codes';
import { VALIDATION_ERROR } from '../helpers/constants/Errors';

const dateTimeRegex = new RegExp('^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9]) (2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?$');

function parseErrors(validationErrors) {
  let errors = [];
  validationErrors.forEach(error => {
    errors.push(
      {
        param: error,
        key: error.keyword,
        message: error.message,
        property: (function() {
          return error.keyword === 'minimum' ? error.dataPath : undefined
        })() 
      }
    );
  });

  return errors;
}

export default schema => (req, res, next) => {
  const ajv = new Ajv({allErrors: true});
  ajv.addFormat('string-of-int', { // YYYY-MM-DD HH:MM:SS
    validate: (string) => !isNaN(string)
  })
  const valid = ajv.validate(schema, req.body);
  if (!valid) {
    const errorParse = parseErrors(ajv.errors)
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(VALIDATION_ERROR(errorParse));
  }
  next();
}