const express = require("express");
const Brand = require("../../models/brands.model");
let router = express.Router();
const Product = require("../../models/products.model");
const upload = require("../../middlewares/multer");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = searchQuery ? { title: { $regex: new RegExp(searchQuery, 'i') } } : {};

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("brand")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.render("./admin/products", {
      layout: "adminLayout",
      pageTitle: "Products Management",
      products,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      searchQuery
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
    console.log('Uploaded file:', req.file);
    console.log('Request body:', req.body);

    if (!req.file) {
        throw new Error('File upload failed. Check Cloudinary and Multer configuration.');
    }

    let newProduct = new Product({
        productImage: req.file.path,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        brand: req.body.brand,
    });

    await newProduct.save();

    res.redirect('/admin/products');
} catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.file) {
      product.productImage = req.file.path;
    }

    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.brand = req.body.brand;

    await product.save();

    res.redirect('/admin/products');
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
