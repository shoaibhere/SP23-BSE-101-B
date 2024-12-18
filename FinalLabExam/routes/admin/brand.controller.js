const express = require('express');
const Brand = require('../../models/brands.model');
let router = express.Router();
const Category = require("../../models/category.model");
const upload = require("../../middlewares/multer");

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = searchQuery ? { brandName: { $regex: new RegExp(searchQuery, 'i') } } : {};
    const totalBrands = await Brand.countDocuments(query);
    const brands = await Brand.find(query)
      .populate('category')
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalBrands / limit);

    res.render('./admin/brands', {
      layout: 'adminLayout',
      pageTitle: 'Brands Management',
      brands,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      searchQuery
    });
  } catch (error) {
    console.error('Error fetching brands with pagination:', error);
    res.status(500).send('An error occurred while fetching brands.');
  }
});


router.get('/create', async(req, res) => {
    let categories = await Category.find();
    res.render('./admin/brandForm', {
        layout: 'adminLayout',
        pageTitle: 'Brands Management',
        categories,
    });
});

router.post('/create', upload.single('brandImage'), async (req, res) => {
    try {
        console.log('Uploaded file:', req.file);
        console.log('Request body:', req.body);

        if (!req.file) {
            throw new Error('File upload failed. Check Cloudinary and Multer configuration.');
        }

        let newBrand = new Brand({
            brandImage: req.file.path,
            brandName: req.body.brandName,
            category:req.body.category
        });

        await newBrand.save();

        res.redirect('/admin/brands');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/delete/:id', async(req,res)=>{
    await Brand.findByIdAndDelete(req.params.id);
    res.redirect('/admin/brands');
});

router.get('/edit/:id',async(req,res)=>{
    let brand = await Brand.findById(req.params.id).populate('category');
    let categories = await Category.find();
    res.render('./admin/brand-edit-form',{
        layout:'adminLayout',
        pageTitle:'Edit Brand',
        brand,
        categories,
    })
});

router.post('/edit/:id', upload.single('brandImage'), async (req, res) => {
    try {
      let brand = await Brand.findById(req.params.id);
  
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
  
      if (req.file) {
        brand.brandImage = req.file.path;
      }
  
      brand.brandName = req.body.brandName;
      brand.category = req.body.category;
  
      await brand.save();
  
      res.redirect('/admin/brands');
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
