const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.set('strictPopulate', false);
const Product = require('./models/products.model');

const dotenv = require("dotenv");

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const server = express();

// Middleware setup
server.use(expressLayouts); // Use layouts for EJS
server.use(express.json()); // Parse JSON request bodies
server.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Static file serving
server.use(express.static("public"));

// Set view engine to EJS
server.set("view engine", "ejs");

// Routers
const adminProductsRouter = require("./routes/admin/product.controller");
server.use(adminProductsRouter);

const portfolioController = require("./routes/portfolio/portfolio.controller");
server.use(portfolioController);

const brandController = require("./routes/admin/brand.controller");
server.use(brandController);

const categoryController = require("./routes/admin/category.controller");
server.use(categoryController);

const brandsViewController = require("./routes/website/brandsview.controller");
server.use(brandsViewController);

const productViewController = require("./routes/website/productsview.controller");
server.use(productViewController);

const cartController = require("./routes/website/cart.controller");
server.use(cartController);

let cookieParser = require("cookie-parser");
server.use(cookieParser());

let session = require("express-session");
server.use(session({ secret: "my session secret" }));

// Home route
server.get("/", (req, res) => {
  res.render("unilever-home");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() =>
    console.log(
      "Connected to MongoDB: " + process.env.MONGODB_CONNECTION_STRING
    )
  )
  .catch((error) => console.error("MongoDB Connection Error:", error.message));

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Project started at http://localhost:${PORT}`);
});
