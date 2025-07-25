const createNewError = require("../util/createNewError");

function roleAndAuthCheck(...roles) {
  return (req, res, next) => {
    if (req.user == null) {
      return next(createNewError("Unauthorised!", 401));
    }

    if (!roles.includes(req.user.role)) {
      // console.log("user is ", req.user);
      return next(createNewError("Forbidden!", 403));
    }

    // console.log("role check working fine");
    return next();
  };
}

module.exports = { roleAndAuthCheck };
