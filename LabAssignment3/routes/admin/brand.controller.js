const express = require('express');
const Brand = require('../../models/brands.model');
let router = express.Router();
const cloudinary = require('../../cloudinary');  // If needed, import cloudinary directly
const upload = require('../../multer');  // Multer configuration

// Display the brand creation form
router.get('/admin/brands/create', (req, res) => {
    res.render('./admin/brandForm', {
        layout: 'adminLayout',
        pageTitle: 'Brands Management',
    });
});

// Handle brand creation with image upload
router.post('/admin/brands/create', upload.single('brandImage'), async (req, res) => {
    try {
        console.log('Uploaded file:', req.file); // 🛠️ Debug: Check if file is uploaded
        console.log('Request body:', req.body); // 🛠️ Debug: Check if body data is being sent

        if (!req.file) {
            throw new Error('File upload failed. Check Cloudinary and Multer configuration.');
        }

        // Save the brand to the database with the Cloudinary image URL
        let newBrand = new Brand({
            brandImage: req.file.path,  // This contains the URL of the uploaded image
            brandName: req.body.brandName,
        });

        await newBrand.save(); // ✅ Save the brand to the database

        res.redirect('/admin/products'); // Redirect to the products page after success
    } catch (error) {
        console.error(error); // 🛠️ Log full error
        res.status(500).json({ error: error.message }); // 🛠️ Send proper error message
    }
});

module.exports = router;
