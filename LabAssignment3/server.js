const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.use(expressLayouts);

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

server.listen(5000,()=>{
  console.log("Project started at localhost:5000");
})
