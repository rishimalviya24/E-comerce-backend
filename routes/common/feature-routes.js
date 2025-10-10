const express = require("express");
const { upload } = require("../../helpers/cloudinary"); // ✅ import 'upload' from helper

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

// ✅ use multer middleware for file upload
router.post("/add", upload.single("image"), addFeatureImage);

router.get("/get", getFeatureImages);

module.exports = router;
