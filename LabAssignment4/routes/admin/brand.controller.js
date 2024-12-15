const express = require('express');
const Brand = require('../../models/brands.model');
let router = express.Router();
const Category = require("../../models/category.model");
const upload = require('../../multer');  // Multer configuration

router.get('/admin/brands', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  
      const skip = (page - 1) * limit; // Calculate how many items to skip
  
      const totalBrands = await Brand.countDocuments(); // Total count of brands
      const brands = await Brand.find()
        .populate('category')
        .skip(skip)
        .limit(limit); // Paginate the results
  
      const totalPages = Math.ceil(totalBrands / limit); // Calculate total pages
  
      res.render('./admin/brands', {
        layout: 'adminLayout',
        pageTitle: 'Brands Management',
        brands,
        currentPage: page,
        totalPages,
        limit, // Pass limit to the frontend
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      });
    } catch (error) {
      console.error('Error fetching brands with pagination:', error);
      res.status(500).send('An error occurred while fetching brands.');
    }
  });
  

// Display the brand creation form
router.get('/admin/brands/create', async(req, res) => {
    let categories = await Category.find();
    res.render('./admin/brandForm', {
        layout: 'adminLayout',
        pageTitle: 'Brands Management',
        categories,
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
            category:req.body.category
        });

        await newBrand.save(); // ✅ Save the brand to the database

        res.redirect('/admin/brands'); // Redirect to the products page after success
    } catch (error) {
        console.error(error); // 🛠️ Log full error
        res.status(500).json({ error: error.message }); // 🛠️ Send proper error message
    }
});

router.get('/admin/brands/delete/:id', async(req,res)=>{
    await Brand.findByIdAndDelete(req.params.id);
    res.redirect('/admin/brands');
});

router.get('/admin/brands/edit/:id',async(req,res)=>{
    let brand = await Brand.findById(req.params.id).populate('category');
    let categories = await Category.find();
    res.render('./admin/brand-edit-form',{
        layout:'adminLayout',
        pageTitle:'Edit Brand',
        brand,
        categories,
    })
});

router.post('/admin/brands/edit/:id', upload.single('brandImage'), async (req, res) => {
    try {
      // Find the existing brand by ID
      let brand = await Brand.findById(req.params.id);
  
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
  
      // Update the brand image if a new file is uploaded
      if (req.file) {
        brand.brandImage = req.file.path;
      }
  
      // Update other fields
      brand.brandName = req.body.brandName;
      brand.category = req.body.category;
  
      // Save the updated brand
      await brand.save();
  
      res.redirect('/admin/brands');
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
