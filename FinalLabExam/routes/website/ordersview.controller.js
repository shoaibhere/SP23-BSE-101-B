const express = require('express');
let router = express.Router();
const Order = require("../../models/order.model");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 

    const skip = (page - 1) * limit;

    const TotalOrders = await Order.countDocuments();
    let userEmail = req.session.user.email;
    const orders = await Order.find({'customer.email':userEmail})
    .populate({
      path: 'products.product',
      populate: {
        path: 'brand', 
      },
    })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(TotalOrders / limit);

    res.render("./ordersPage", {
      orders,
      pageTitle:"Manage My Orders",
      currentPage: page,
      totalPages,
      limit, 
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
      path: 'brand',
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
