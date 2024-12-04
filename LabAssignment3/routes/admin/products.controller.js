const express = require("express");
let router = express.Router();
const Product = require("../../models/products.model");
router.get("/admin/products", async(req,res)=>{
  let products = await Product.find();
  return res.render("./admin/products",{
    layout: "adminLayout",
    pageTitle:"Products Management",
    products,
  });
});

module.exports = router;