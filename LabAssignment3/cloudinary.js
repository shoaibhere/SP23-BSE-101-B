const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createCloudinaryStorage = ({
  folder = "brandImage",
  resourceType = "image",
  format = async (req, file) => {
    const mimeType = file.mimetype.split("/")[1];
    const allowedFormats = ["jpeg", "png", "jpg", "gif"];
    return allowedFormats.includes(mimeType) ? mimeType : "jpeg";
  },
  publicId,
}) => {
  console.log(cloudinary);
  return new CloudinaryStorage({ 
    cloudinary,
    params: {
      folder,
      resource_type: resourceType,
      format,
      public_id:
        publicId || ((req, file) => `${Date.now()}_${file.originalname}`),
    },
  });
};

module.exports = { createCloudinaryStorage };
