const express = require("express");
let router = express.Router();
router.get("/about-me",(req,res)=>{
  return res.render("portfolio",{
    layout: "portFolioLayout"
  });
})
module.exports = router;