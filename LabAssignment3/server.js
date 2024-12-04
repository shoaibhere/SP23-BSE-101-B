const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
const mongoose = require("mongoose");
const Product = require("./models/products.model");

server.use(expressLayouts);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let createRouter = require("./routes/admin/create.controller");
server.use(createRouter);

let portfolioController = require("./routes/portfolio/portfolio.controller");
server.use(portfolioController);

server.set("view engine","ejs");

server.use(express.static("public"));

server.get("/",(req,res)=>{
  res.render("unilever-home");
});

let connectionString = "mongodb://localhost:27017/webtech ";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

server.listen(5000,()=>{
  console.log("Project started at localhost:5000");
})
