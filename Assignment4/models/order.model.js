const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD"], // Only Cash on Delivery for now
      default: "COD",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Price at the time of order
      },
    ],
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create Order model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
