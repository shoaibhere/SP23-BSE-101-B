const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"], // Restrict roles to 'customer' and 'admin'
      default: "customer", // Default role is 'customer'
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
