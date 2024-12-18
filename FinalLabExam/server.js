const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.set("strictPopulate", false);

const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const server = express();

server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(express.static("public"));

server.set("view engine", "ejs");

const cookieParser = require("cookie-parser");
server.use(cookieParser());

const session = require("express-session");
server.use(
  session({
    secret: process.env.SECRET || "my_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const siteMiddleware = require("./middlewares/site-middleware");
server.use(siteMiddleware);

const authMiddleware = require("./middlewares/auth-middleware");
const adminMiddleware = require("./middlewares/admin-middleware");

const authRouter = require("./routes/auth.controller");
server.use(authRouter);

const adminRoute = require("./routes/admin/admin.controller");
server.use("/admin",authMiddleware,adminMiddleware,adminRoute);

const productViewController = require("./routes/website/productsview.controller");
server.use("/products", authMiddleware, productViewController);

const cartController = require("./routes/website/cart.controller");
server.use("/cart", authMiddleware, cartController);

const myordersController = require("./routes/website/ordersview.controller");
server.use("/myOrders", authMiddleware, myordersController);

const brandsViewController = require("./routes/website/brandsview.controller");
server.use("/brands", brandsViewController);

const portfolioController = require("./routes/portfolio/portfolio.controller");
server.use("/about-me", portfolioController);

server.get("/", (req, res) => {
  res.render("unilever-home");
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() =>
    console.log(
      "Connected to MongoDB: " + process.env.MONGODB_CONNECTION_STRING
    )
  )
  .catch((error) => console.error("MongoDB Connection Error:", error.message));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Project started at http://localhost:${PORT}`);
});
