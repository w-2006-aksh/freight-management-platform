const express = require("express");
const router = express.Router();

const tripController = require("../controllers/trip");

router.get("/details/:bidNo", tripController.getTripDetails);
router.get("/get-status/:bidNo", tripController.getTripStatus);
router.post("/mark-as-picked/:bidNo", tripController.markAsPicked);
router.post("/mark-as-delivered/:bidNo", tripController.markAsDelivered);
router.post("/update-location/:bidNo", tripController.updateLocation);

module.exports = router;
