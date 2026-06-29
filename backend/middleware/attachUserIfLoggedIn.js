const jwt = require("jsonwebtoken");

function attachUserIfLoggedIn(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = attachUserIfLoggedIn;
