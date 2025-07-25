const errorHandler = (err, req, res, next) => {
  console.log(err);

  const message = err.message || "Could not perform action!";
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
