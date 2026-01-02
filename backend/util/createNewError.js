const createNewError = (message, statusCode) => {
  const error = new Error();
  error.message = message;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

module.exports = createNewError;
