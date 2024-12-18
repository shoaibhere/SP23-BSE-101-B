const express = require("express");
const Category = require("../../models/category.model");
const router = express.Router();

router.get('/create', (req,res)=>{
  res.render('admin/category-form',{
    layout:'adminLayout',
    pageTitle:'Category Management',
  });
});

router.get('/', async (req,res)=>{
  let categories = await Category.find();
  res.render('admin/categories',{
    layout:'adminLayout',
    pageTitle:'Category Management',
    categories
  });
});

router.post('/create', async (req,res)=>{
  let category = new Category({
    categoryName:req.body.categoryName,
  });

  await category.save();
  res.redirect('/admin/categories');
});

router.get('/delete/:id', async(req,res)=>{
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/admin/categories');
});

router.get('/edit/:id', async(req,res)=>{
  let category= await Category.findById(req.params.id);
  res.render('admin/category-edit-form',{
    category,
    pageTitle: 'Edit Category',
    layout: 'adminLayout'
  });
});

router.post('/edit/:id', async(req,res)=>{
  let {categoryName} = req.body;
  await Category.findByIdAndUpdate(
    req.params.id,
    {categoryName},
    {new:true}
  );
  res.redirect('/admin/categories');
});
module.exports = router;