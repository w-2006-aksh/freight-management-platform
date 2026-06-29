const express = require("express");
const router = express.Router();

const formDataValidator = require("../middleware/formDataValidator");
const postDetailsSchema = require("../formDataValidate/transporter/postDetails");

const transporterController = require("../controllers/transporter");
const handleTransportDetailsUpload = require("../middleware/handleTransportDetailsUpload");

router.get("/live-bids", transporterController.getLiveBids);
router.get("/my-bids", transporterController.getMyBids);

router.post("/:bidNo/post-a-quote", transporterController.postQuote);

router.post(
  "/:bidId/upload-details",
  handleTransportDetailsUpload,
  formDataValidator(postDetailsSchema),
  transporterController.uploadDetails
);

router.get("/get-bid-details/:bidNo", transporterController.getBidDetails);
router.post("/bid/:bidId/reject", transporterController.rejectBid);

module.exports = router;
