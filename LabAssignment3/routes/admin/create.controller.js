const express = require("express");
const Brand = require("../../models/brands.model");
let router = express.Router();
const Product = require("../../models/products.model");
const cloudinary = require("../../cloudinary");
const upload = require("../../multer");

router.get("/admin/products/create",async (req,res)=>{
  try {
    const brands = await Brand.find().populate('brandName');
    res.render("./admin/createForm",{
    layout: "adminLayout",
    pageTitle:"Products Management",
    brands,
  })}
  catch (error){
    res.status(500).send('Error'+error.message);
  }
});

router.post("/admin/products/create",upload.single('productImage'), async(req,res)=>
{
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products' // Folder name in Cloudinary
    });
  let newProduct = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    postImage: result.secure_url,
    brand: req.body.brand
  });
  await newProduct.save();
  res.redirect("/admin/products");
} catch (error) {
  res.status(500).send('Error uploading file: ' + error.message);
}
});
router.get("/admin/products/delete/:_id", async(req,res)=>
{
  let id= req.params._id;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
});

router.get("/admin/products/edit/:_id", async(req,res)=>{
  let id= req.params._id;
  let product = await Product.findById(id);
  res.render("admin/product-edit-form",{
    layout: "adminLayout",
    pageTitle:"Edit Product",
    product
  });
});

router.post("/admin/products/edit/:_id", async(req,res)=>{
  let {title,description,type,price}=req.body;
  await Product.findByIdAndUpdate(
    req.params._id,
    {title,description,type,price}, 
    {new:true}
  );
  res.redirect("/admin/products");
});
module.exports = router;