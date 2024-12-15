const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary');

// Set up Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'brands', // Folder name in Cloudinary to store the images
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif','avif','webp'],
        transformation: [{ width: 500, height: 500, crop: 'fill' }], // Allowed image formats
    },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
