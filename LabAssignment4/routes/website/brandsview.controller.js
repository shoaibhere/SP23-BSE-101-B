const express = require('express');
const Brand = require('../../models/brands.model');
let router = express.Router();
const Category = require("../../models/category.model");

router.get("/brands", async (req, res) => {
  try {
      const { search, category, sort } = req.query;

      // Base Query
      let query = {};

      // Search Query: Filter brands by name (case-insensitive)
      if (search) {
          query.brandName = { $regex: search, $options: "i" }; // Case-insensitive search
      }

      // Filter Query: Filter by category ID
      if (category) {
          query.category = category;
      }

      // Fetch filtered and searched brands
      let brandsQuery = Brand.find(query).populate("category");

      // Sorting: Sort by brandName (A-Z or Z-A)
      if (sort === "A-Z") {
          brandsQuery = brandsQuery.sort({ brandName: 1 }); // Ascending
      } else if (sort === "Z-A") {
          brandsQuery = brandsQuery.sort({ brandName: -1 }); // Descending
      }

      // Execute Query
      const brands = await brandsQuery;

      // Fetch Categories for Filtering
      const categories = await Category.find();

      // Render View with Brands and Categories
      res.render("brandsPage", { brands, categories, selectedCategory: category, searchQuery: search, sortOption: sort });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});
  
module.exports = router;
