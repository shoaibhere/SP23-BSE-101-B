const express = require('express');
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
    let userEmail = req.session.user.email;
    // Fetch products with pagination and populate the brand
    const orders = await Order.find({'customer.email':userEmail})
    .populate({
      path: 'products.product',
      populate: {
        path: 'brand', // Populate the brand field within the product
      },
    })
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(TotalOrders / limit);

    // Render the products page with pagination details
    res.render("./ordersPage", {
      orders,
      pageTitle:"Manage My Orders",
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

router.get('/view/:id',async(req,res)=>{
  const order = await Order.findById(req.params.id)
  .populate({
    path: 'products.product',
    populate: {
      path: 'brand', // Populate the brand field within the product
    },
  });
  res.render('view-order',{
    order,
  });
});

router.get('/delete/:id', async(req,res)=>{
  let orderStatus='Cancelled';
  await Order.findByIdAndUpdate(req.params.id,{orderStatus},{new:true});
  res.redirect('/myorders');
});
module.exports = router;
