const createNewError = require("../util/createNewError");

function roleAndAuthCheck(...roles) {
  return (req, res, next) => {
    if (req.user == null) {
      return next(createNewError("Unauthorised!", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createNewError("Forbidden!", 403));
    }

    return next();
  };
}

module.exports = { roleAndAuthCheck };
