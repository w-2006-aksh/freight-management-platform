const express = require("express");
const router = express.Router();
const Bid = require("../models/bid");

router.get("/getBidDetails/:bidNo/", async (req, res) => {
  // console.log('req rec')
  try {
    const bidNo = Number(req.params.bidNo);
    const bid = await Bid.findOne({ bidNo });
    // console.log(bid);
    if (!bid)
      return res.status(404).json({ success: false, message: "No such bid" });
    return res.status(200).json({ success: true, bid });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
  }
});

module.exports = router;
