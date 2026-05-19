const ApiError = require('../utils/ApiError');

function validateSchema(schema, source = 'body') {
  return (req, res, next) => {
    const target = req[source] || {};
    const { value, error } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(400, 'Validation failed', {
          fields: error.details.map((item) => ({
            message: item.message,
            path: item.path.join('.'),
          })),
        })
      );
    }

    req[source] = value;
    return next();
  };
}

module.exports = validateSchema;
