const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let filePath = "";
    if (file.fieldname == "driverLicense") {
      filePath = "public/uploads/driverLicense";
    } else if (file.fieldname == "vehicleDocument") {
      filePath = "public/uploads/vehicleDocument";
    } else filePath = "public/uploads/others";
    
    cb(null, filePath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,

  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF Files are allowed!"), false);
    }
  },
});

module.exports = upload;
