const express = require("express");
const Brand = require("../../models/brands.model");
let router = express.Router();
const Product = require("../../models/products.model");
const upload = require("../../middlewares/multer");


router.get("/", async (req, res) => {
  try {
    // Extract `page` and `limit` from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index
    const skip = (page - 1) * limit;

    // Fetch total number of products
    const totalProducts = await Product.countDocuments();

    // Fetch products with pagination and populate the brand
    const products = await Product.find()
      .populate("brand")
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    // Render the products page with pagination details
    res.render("./admin/products", {
      layout: "adminLayout",
      pageTitle: "Products Management",
      products,
      currentPage: page,
      totalPages,
      limit, // Pass limit to the frontend
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});


router.get("/create",async (req,res)=>{
  try {
    const brands = await Brand.find().populate('brandName');
    res.render("./admin/productForm",{
    layout: "adminLayout",
    pageTitle:"Products Management",
    brands,
  })}
  catch (error){
    res.status(500).send('Error'+error.message);
  }
});

router.post("/create",upload.single('productImage'), async(req,res)=>
{
  try {
    console.log('Uploaded file:', req.file); // 🛠️ Debug: Check if file is uploaded
    console.log('Request body:', req.body); 

    if (!req.file) {
        throw new Error('File upload failed. Check Cloudinary and Multer configuration.');
    }

    // Save the broduct to the database with the Cloudinary image URL
    let newProduct = new Product({
        productImage: req.file.path,  // This contains the URL of the uploaded image
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        brand: req.body.brand,
    });

    await newProduct.save(); // ✅ Save the brand to the database

    res.redirect('/admin/products'); // Redirect to the products page after success
} catch (error) {
    console.error(error); // 🛠️ Log full error
    res.status(500).json({ error: error.message }); // 🛠️ Send proper error message
}

});
router.get("/delete/:_id", async(req,res)=>
{
  let id= req.params._id;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
});

router.get("/edit/:id", async(req,res)=>{
  let id= req.params.id;
  let product = await Product.findById(id).populate('brand');
  let brands = await Brand.find();
  res.render("admin/product-edit-form",{
    layout: "adminLayout",
    pageTitle:"Edit Product",
    product,
    brands
  });
});

router.post("/edit/:id",upload.single('productImage'), async(req,res)=>{
  try {
    // Find the existing product by ID
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the prod image if a new file is uploaded
    if (req.file) {
      product.productImage = req.file.path;
    }

    // Update other fields
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.brand = req.body.brand;

    // Save the updated brand
    await product.save();

    res.redirect('/admin/products');
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;