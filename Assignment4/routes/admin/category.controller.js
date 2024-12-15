const express = require("express");
const Category = require("../../models/category.model");
const upload = require("../../multer");
const router = express.Router();

router.get('/admin/categories/create', (req,res)=>{
  res.render('admin/category-form',{
    layout:'adminLayout',
    pageTitle:'Category Management',
  });
});

router.get('/admin/categories', async (req,res)=>{
  let categories = await Category.find();
  res.render('admin/categories',{
    layout:'adminLayout',
    pageTitle:'Category Management',
    categories
  });
});

router.post('/admin/categories/create', async (req,res)=>{
  let category = new Category({
    categoryName:req.body.categoryName,
  });

  await category.save();
  res.redirect('/admin/categories');
});

router.get('/admin/categories/delete/:id', async(req,res)=>{
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/admin/categories');
});

router.get('/admin/categories/edit/:id', async(req,res)=>{
  let category= await Category.findById(req.params.id);
  res.render('admin/category-edit-form',{
    category,
    pageTitle: 'Edit Category',
    layout: 'adminLayout'
  });
});

router.post('/admin/categories/edit/:id', async(req,res)=>{
  let {categoryName} = req.body;
  await Category.findByIdAndUpdate(
    req.params.id,
    {categoryName},
    {new:true}
  );
  res.redirect('/admin/categories');
});
module.exports = router;