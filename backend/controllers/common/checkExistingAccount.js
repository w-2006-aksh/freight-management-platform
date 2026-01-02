const createNewError = require("../../util/createNewError");

module.exports = async ({ Model, query }) => {
  const existing = await Model.findOne(query);

  if (existing) {
    throw createNewError("Information already in use!", 409);
  }
};
