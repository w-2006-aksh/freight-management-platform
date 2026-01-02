const jwt = require("jsonwebtoken");

function verifyTripToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TRIP_SECRET);
    req.trip = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = verifyTripToken;
