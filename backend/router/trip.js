const express = require("express");
const router = express.Router();

const tripController = require("../controllers/trip");
const verifyTripToken = require("../middleware/verifyTripToken");


router.get("/details/:bidNo", verifyTripToken, tripController.getTripDetails);
router.get("/get-status/:bidNo", verifyTripToken, tripController.getTripStatus);
router.post(
  "/mark-as-picked/:bidNo",
  verifyTripToken,
  tripController.markAsPicked
);
router.post(
  "/mark-as-delivered/:bidNo",
  verifyTripToken,
  tripController.markAsDelivered
);
router.post(
  "/update-location/:bidNo",
  verifyTripToken,
  tripController.updateLocation
);

router.get("/open/:bidNo", tripController.openBidInApp);

module.exports = router;
