const Feature = require("../../models/Feature");
const { imageUploadUtil } = require("../../helpers/cloudinary");

const addFeatureImage = async (req, res) => {
  try {
    // ✅ Check file existence
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }
    console.log("File received:", req.file.originalname);

    // ✅ Convert file buffer to base64 for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // ✅ Upload to Cloudinary
    const result = await imageUploadUtil(dataURI);

    // ✅ Save URL to DB
    const featureImage = new Feature({
      image: result.secure_url,
    });

    await featureImage.save();

    res.status(201).json({
      success: true,
      data: featureImage,
    });
  } catch (e) {
    console.error("❌ Error in addFeatureImage:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };
