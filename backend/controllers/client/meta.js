const citydata = require("../../data/cities.json");

const createNewError = require("../../util/createNewError");

exports.getCities = (req, res, next) => {
  try {
    return res.status(200).json({ data: citydata });
  } catch (err) {
    next(err);
  }
};
