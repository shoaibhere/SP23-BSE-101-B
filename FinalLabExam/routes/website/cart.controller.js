const express = require('express');
let router = express.Router();
const Product = require("../../models/products.model");
const Order = require("../../models/order.model");

let cookieParser = require("cookie-parser");
router.use(cookieParser());

let session = require("express-session");
router.use(session({ secret: "my session secret" }));

router.get("/", async (req, res) => {
  try {
      let cart = req.cookies.cart;
      cart = cart ? JSON.parse(cart) : []; 

      const productIds = cart.map(item => item.id);

      let products = await Product.find({ _id: { $in: productIds } }).populate('brand');

      const productsWithQuantities = products.map(product => {
          const cartItem = cart.find(item => item.id === product._id.toString());
          return {
              ...product._doc, 
              quantity: cartItem ? cartItem.quantity : 1 
          };
      });

      const totalPrice = productsWithQuantities.reduce((total, product) => {
          return total + product.price * product.quantity;
      }, 0);

      console.log(productsWithQuantities);

      return res.render("cart", { products: productsWithQuantities, cart, totalPrice });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});

router.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : []; 
  const productId = req.params.id;

  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex > -1) {
      cart[productIndex].quantity += 1;
  } else {
      cart.push({ id: productId, quantity: 1 });
  }

  res.cookie("cart", JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000 }); 
  return res.redirect("/brands");
});

router.get("/remove/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? JSON.parse(cart) : [];

  cart = cart.filter(item => item.id !== req.params.id);

  res.cookie("cart", JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000 }); 
  res.redirect("/cart");
});

router.get('/checkout', async(req,res)=>{
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : []; 
  const productIds = cart.map(item => item.id);
  let products = await Product.find({ _id: { $in: productIds } }).populate('brand');

  const productsWithQuantities = products.map(product => {
    const cartItem = cart.find(item => item.id === product._id.toString());
    return {
        ...product._doc, 
        quantity: cartItem ? cartItem.quantity : 1 
    };
});
   const totalPrice = productsWithQuantities.reduce((total, product) => {
    return total + product.price * product.quantity;
}, 0);

  res.render('checkout',{
    products:productsWithQuantities,totalPrice,user:req.session.user
  });
});

router.post("/checkout", async (req, res) => {
  try {
    const { paymentMethod, cardNumber, cardExpiry, cardCVC } = req.body;
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send("Cart is empty or not provided.");
    }

    const productIds = cart.map(item => item.id);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    const products = cart.map(cartItem => {
      const productDetails = productsFromDB.find(product => product._id.toString() === cartItem.id);
      if (!productDetails) {
        throw new Error(`Product with ID ${cartItem.id} not found.`);
      }
      return {
        product: productDetails._id,
        quantity: cartItem.quantity,
        price: productDetails.price,
      };
    });

    const totalPrice = products.reduce((total, item) => total + item.price * item.quantity, 0);

    // Handle payment based on the selected method
    if (paymentMethod === 'Card') {
      // Simulate card payment processing
      console.log("Processing card payment:");
      console.log(`Card Number: ${cardNumber}, Expiry: ${cardExpiry}, CVC: ${cardCVC}`);

      // Add basic validation for card details
      if (!cardNumber || !cardExpiry || !cardCVC) {
        res.status(400).send("Invalid card details provided.");
        return;
      }

      // Optionally log card details to a secure location or handle according to your security policy
      // NOTE: In real applications, never log sensitive information like this!
    }

    let order = new Order({
      customer: {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        email: req.session.user.email,
        phone: req.body.phone,
      },
      shippingAddress: {
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
      },
      paymentMethod: paymentMethod,  // Record the payment method in the order
      products, 
      totalPrice,
    });

    await order.save();

    // Clear the shopping cart cookie as the order has been successfully placed
    res.clearCookie("cart");

    // Redirect to a success page with the order ID
    res.redirect(`/cart/order-success/${order._id}`);
  } catch (err) {
    console.error("Error during checkout:", err.message);
    res.status(500).send("Server Error");
  }
});

  

router.get('/order-success/:id', async (req, res) => {
  try {
    // Find the order and populate both 'products.product' and 'products.product.brand'
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'products.product',
        populate: {
          path: 'brand', // Populate the brand field within the product
        },
      });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Render the order-success page with the populated order
    res.render('order-success', { order });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
