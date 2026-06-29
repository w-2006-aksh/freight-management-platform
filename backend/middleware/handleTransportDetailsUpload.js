const upload = require("../storage/multer");
const createNewError = require("../util/createNewError");

function handleTransportDetailsUpload(req, res, next) {
  const uploadHandler = upload.fields([
    { name: "driverLicense", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 },
  ]);

  uploadHandler(req, res, (error) => {
    if (error) {
      throw createNewError(
        "Upload failed! Check size and format of documents!",
        400
      );
    }
    next();
  });
}

module.exports = handleTransportDetailsUpload;
