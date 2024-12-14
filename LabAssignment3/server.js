const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
const mongoose = require("mongoose");
const Product = require("./models/products.model");
const dotenv = require("dotenv");
dotenv.config({path:".env.local"});

server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let createRouter = require("./routes/admin/create.controller");
server.use(createRouter);

let portfolioController = require("./routes/portfolio/portfolio.controller");
server.use(portfolioController);

let brandController = require("./routes/admin/brand.controller");
server.use(brandController);

server.set("view engine","ejs");

server.use(express.static("public"));

server.get("/",(req,res)=>{
  res.render("unilever-home");
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to Mongo DB Server: " + process.env.MONGODB_CONNECTION_STRING))
  .catch((error) => console.log(error.message));

server.listen(5000,()=>{
  console.log("Project started at localhost:5000");
})
