const express = require("express");
let router = express.Router();
const Order = require("../../models/order.model");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    const skip = (page - 1) * limit;
    let query = {};
    if (searchQuery) {
      query = {
        $or: [
          {"customer.firstName": { $regex: new RegExp(searchQuery, 'i') }},
          {"customer.lastName": { $regex: new RegExp(searchQuery, 'i') }}
        ]
      };
    }

    const TotalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("products.product")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(TotalOrders / limit);

    res.render("./admin/orders", {
      layout: "adminLayout",
      pageTitle: "Orders Management",
      orders,
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      searchQuery
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
      path: 'brand',
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
