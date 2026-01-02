const express = require("express");
const router = express.Router();

const formDataValidator = require("../middleware/formDataValidator");
const createBidSchema = require("../formDataValidate/client/createBid");

const clientController = require("../controllers/client");

router.get("/getCities", clientController.getCities);

router.post(
  "/post-a-bid",
  formDataValidator(createBidSchema),
  clientController.createBid
);

router.get("/live-bids", clientController.getLiveBids);
router.get("/delivered-bids", clientController.getDeliveredBids);
router.get("/in-progress-bids", clientController.getInProgressBids);
router.get("/expired-bids/", clientController.getExpiredBids);

router.get("/:bidId/see-quotes", clientController.getQuotes);
router.post("/:bidId/accept-quote", clientController.acceptQuote);

router.get("/:bidId/details", clientController.getBidDetails);
router.post("/:bidId/confirm-details", clientController.confirmDetails);

router.get("/:bidNo/journey", clientController.getJourney);

router.get("/get-all-transporters", clientController.getAllTransporters);
router.put("/trusted-transporters", clientController.updateTrustedTransporters);

module.exports = router;
