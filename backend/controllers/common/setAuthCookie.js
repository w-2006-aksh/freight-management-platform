const jwt = require("jsonwebtoken");

module.exports = (res, payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: false,
  });

  return token;
};
