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
      cart = cart ? JSON.parse(cart) : []; // Parse the cart cookie (id and quantity)

      // Extract product IDs from the cart
      const productIds = cart.map(item => item.id);

      // Fetch products from the database
      let products = await Product.find({ _id: { $in: productIds } }).populate('brand');

      // Merge products with their quantities from the cart
      const productsWithQuantities = products.map(product => {
          const cartItem = cart.find(item => item.id === product._id.toString());
          return {
              ...product._doc, // Product details from MongoDB
              quantity: cartItem ? cartItem.quantity : 1 // Add quantity
          };
      });

      // Calculate the total price
      const totalPrice = productsWithQuantities.reduce((total, product) => {
          return total + product.price * product.quantity;
      }, 0);

      console.log(productsWithQuantities);

      // Render the cart page with updated product data and total price
      return res.render("cart", { products: productsWithQuantities, cart, totalPrice });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
  }
});

router.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : []; // Retrieve the cart, parse JSON
  const productId = req.params.id;

  // Check if the product already exists in the cart
  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex > -1) {
      // If product exists, increase its quantity
      cart[productIndex].quantity += 1;
  } else {
      // If product doesn't exist, add it with quantity 1
      cart.push({ id: productId, quantity: 1 });
  }

  // Set the updated cart in cookies
  res.cookie("cart", JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Expires in 7 days
  return res.redirect("/brands");
});

router.get("/remove/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? JSON.parse(cart) : [];

  // Filter out the product with the matching ID
  cart = cart.filter(item => item.id !== req.params.id);

  // Update the cart cookie
  res.cookie("cart", JSON.stringify(cart), { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7-day expiry
  res.redirect("/cart");
});

router.get('/checkout', async(req,res)=>{
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : []; // Retrieve the cart, parse JSON
  const productIds = cart.map(item => item.id);
  // Fetch products from the database
  let products = await Product.find({ _id: { $in: productIds } }).populate('brand');

  const productsWithQuantities = products.map(product => {
    const cartItem = cart.find(item => item.id === product._id.toString());
    return {
        ...product._doc, // Product details from MongoDB
        quantity: cartItem ? cartItem.quantity : 1 // Add quantity
    };
});
   // Calculate the total price
   const totalPrice = productsWithQuantities.reduce((total, product) => {
    return total + product.price * product.quantity;
}, 0);

  res.render('checkout',{
    products:productsWithQuantities,totalPrice
  });
});

router.post("/checkout", async (req, res) => {
  try {
    // Step 1: Parse cart from cookies
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send("Cart is empty or not provided.");
    }

    // Step 2: Extract product IDs and fetch product details from MongoDB
    const productIds = cart.map(item => item.id);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });

    // Step 3: Map product details with quantities from the cart
    const products = cart.map(cartItem => {
      const productDetails = productsFromDB.find(product => product._id.toString() === cartItem.id);
      if (!productDetails) {
        throw new Error(`Product with ID ${cartItem.id} not found.`);
      }
      return {
        product: productDetails._id, // MongoDB ObjectID
        quantity: cartItem.quantity, // Quantity from the cart
        price: productDetails.price, // Price from MongoDB
      };
    });

    // Step 4: Calculate total price
    const totalPrice = products.reduce((total, item) => total + item.price * item.quantity, 0);

    // Step 5: Create the Order object
    let order = new Order({
      customer: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      },
      shippingAddress: {
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
      },
      paymentMethod: "COD",
      products, // Fetched and mapped products with quantity and price
      totalPrice,
    });

    // Save the order
    await order.save();

    // Clear cart cookie
    res.clearCookie("cart");

    // Redirect to success page
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
