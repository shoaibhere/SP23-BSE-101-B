const express = require('express');
const Brand = require('../../models/brands.model');
let router = express.Router();
const Category = require("../../models/category.model");

router.get("/", async (req, res) => {
  try {
      const { search, category, sort } = req.query;

      let query = {};

      if (search) {
          query.brandName = { $regex: search, $options: "i" }; 
      }

      if (category) {
          query.category = category;
      }

      let brandsQuery = Brand.find(query).populate("category");

      if (sort === "A-Z") {
          brandsQuery = brandsQuery.sort({ brandName: 1 }); 
      } else if (sort === "Z-A") {
          brandsQuery = brandsQuery.sort({ brandName: -1 }); 
      }

      const brands = await brandsQuery;

      const categories = await Category.find();

      res.render("brandsPage", { brands, categories, selectedCategory: category, searchQuery: search, sortOption: sort });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});
  
module.exports = router;
