const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.set("strictPopulate", false);

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

// Session and Cookie Parsers (IMPORTANT: Load these BEFORE auth middleware)
const cookieParser = require("cookie-parser");
server.use(cookieParser());

const session = require("express-session");
server.use(
  session({
    secret: process.env.SECRET || "my_secret", // Use a strong, unique secret
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Only save sessions with data
    cookie: { secure: false }, // Use secure: true in production (with HTTPS)
  })
);

// Custom Middleware
const siteMiddleware = require("./middlewares/site-middleware");
server.use(siteMiddleware);

const authMiddleware = require("./middlewares/auth-middleware");
const adminMiddleware = require("./middlewares/admin-middleware");

// Authentication Routes (POST for login/register)
const authRouter = require("./routes/auth.controller");
server.use(authRouter);

// Protected Admin Routes (Require Authentication)
const adminRoute = require("./routes/admin/admin.controller");
server.use("/admin",authMiddleware,adminMiddleware,adminRoute);

//Login Required
const productViewController = require("./routes/website/productsview.controller");
server.use("/products", authMiddleware, productViewController);

const cartController = require("./routes/website/cart.controller");
server.use("/cart", authMiddleware, cartController);

// Public Website Routes (No Authentication Required)
const brandsViewController = require("./routes/website/brandsview.controller");
server.use("/brands", brandsViewController);

const portfolioController = require("./routes/portfolio/portfolio.controller");
server.use("/about-me", portfolioController);

// Home route (No Authentication Required)
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Project started at http://localhost:${PORT}`);
});
