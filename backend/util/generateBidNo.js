const mongoose = require("mongoose");

async function generateBidNo() {
  const result = await mongoose.connection.db
    .collection("counter")
    .findOneAndUpdate(
      { _id: "bidNo" },
      { $inc: { count: 1 } },
      { returnDocument: "after", upsert: true }
    );

  return result.count;
}

module.exports = generateBidNo;
