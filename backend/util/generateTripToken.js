const jwt = require("jsonwebtoken");

function generateTripToken({ bidNo, from, to }) {
  return jwt.sign({ bidNo, from, to }, process.env.TRIP_SECRET, {
    expiresIn: "3d",
  });
}
module.exports = { generateTripToken };
