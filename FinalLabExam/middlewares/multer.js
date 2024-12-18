const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'brands', 
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif','avif','webp'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }], 
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
