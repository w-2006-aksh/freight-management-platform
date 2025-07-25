const createNewError = require("../util/createNewError");

const validate = (schema) => async (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return next(createNewError(firstError.message, 400));
  }

  req.body = result.data;
  next();
};

module.exports = validate;
