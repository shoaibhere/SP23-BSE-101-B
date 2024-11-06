const express = require("express");
let server = express();

server.set("view engine","ejs");

server.use(express.static("public"));

server.get("/",(req,res)=>{
  res.render("unilever-home");
});

server.get("/about-me",(req,res)=>{
  res.render("portfolio");
});

server.listen(5000,()=>{
  console.log("Project started at localhost:5000");
})
