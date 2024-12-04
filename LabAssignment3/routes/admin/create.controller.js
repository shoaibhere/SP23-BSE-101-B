const express = require("express");
let router = express.Router();
const Product = require("../../models/products.model");
router.get("/admin/products/create",(req,res)=>{
  return res.render("./admin/createForm",{
    layout: "adminLayout",
    pageTitle:"Products Management",
  });
});
router.post("/admin/products/create", async(req,res)=>
{
  let data = req.body;
  let newProduct = new Product(data);
  await newProduct.save();
  res.redirect("/admin/products");
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