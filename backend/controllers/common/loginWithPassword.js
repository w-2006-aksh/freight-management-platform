const createNewError = require("../../util/createNewError");
const jwt = require("jsonwebtoken");
const redisClient = require("../../config/redis");

module.exports = async function loginWithPassword({
  req,
  res,
  next,
  Model,
  maxPasswordAttempts,
}) {
  if (req.user != null) {
    throw createNewError("Already logged in!", 409);
  }

  try {
    const { phNo, password } = req.body;

    const user = await Model.findOne({ phNo });
    if (!user) {
      throw createNewError("Phone number not registered", 404);
    }

    const isBlockedKey = `isAccountBlocked:${phNo}`;
    const attemptsKey = `passwordAttempts:${phNo}`;

    if (await redisClient.get(isBlockedKey)) {
      throw createNewError("Account temporarily blocked", 429);
    }

    const isMatch = await user.ComparePassword(password);
    if (!isMatch) {
      const attempts = await redisClient.incr(attemptsKey);

      if (attempts === 1) {
        await redisClient.expire(attemptsKey, 10 * 60);
      }

      if (attempts >= maxPasswordAttempts) {
        await redisClient.setEx(isBlockedKey, 15 * 60, "true");
        await redisClient.del(attemptsKey);
      }

      throw createNewError("Incorrect Password", 401);
    }

    await redisClient.del(attemptsKey);

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phNo: user.phNo,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in!",
      user: payload,
    });
  } catch (err) {
    next(err);
  }
};
