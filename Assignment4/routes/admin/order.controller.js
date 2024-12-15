const express = require("express");
let router = express.Router();
const Order = require("../../models/order.model");

router.get("/", async (req, res) => {
  try {
    // Extract `page` and `limit` from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index
    const skip = (page - 1) * limit;

    // Fetch total number of products
    const TotalOrders = await Order.countDocuments();

    // Fetch products with pagination and populate the brand
    const orders = await Order.find()
      .populate("products.product")
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(TotalOrders / limit);

    // Render the products page with pagination details
    res.render("./admin/orders", {
      layout: "adminLayout",
      pageTitle: "Orders Management",
      orders,
      currentPage: page,
      totalPages,
      limit, // Pass limit to the frontend
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching orders with pagination:", error);
    res.status(500).send("An error occurred while fetching orders.");
  }
});

router.get('/delete/:id', async(req,res)=>{
  await Order.findByIdAndDelete(req.params.id);
  res.redirect('/admin/orders');
});

router.get('/view/:id', async(req,res)=>{
  const order = await Order.findById(req.params.id)
  .populate({
    path: 'products.product',
    populate: {
      path: 'brand', // Populate the brand field within the product
    },
  });
  res.render('admin/view-order',{
    order,
    layout:'adminLayout'
  });
});

router.post('/update-status/:id', async(req,res)=>{
  let {orderStatus} = req.body;
  await Order.findByIdAndUpdate(req.params.id,{orderStatus},{new:true});
  res.redirect('/admin/orders');  
});
module.exports = router;