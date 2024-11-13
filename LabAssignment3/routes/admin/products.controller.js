const express = require("express");
let router = express.Router();
router.get("/admin/products",(req,res)=>{
  let products = [
    {
      _id:1,
      name:'Iphone',
      description:'13 Pro Max',
      price:300000
    },
    {
      _id:2,
      name:'Samsung',
      description:'S22 Ultra',
      price:250000
    },
    {
      _id:3,
      name:'Nokia',
      description:'3310',
      price:20000
    }
  ];
  return res.render("./admin/products",{
    layout: "adminLayout",
    pageTitle:"Products Management",
    products,
  });
});
module.exports = router;