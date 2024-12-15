const express = require("express");
let router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

// Public Routes (No Authentication Required)
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/"); // Redirect logged-in users to home
  }
  res.render("auth/login", { error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let error = null;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      error = "User does not exist.";
      return res.render("auth/login", { error });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      error = "Incorrect password.";
      return res.render("auth/login", { error });
    }

    // Set session user on successful login
    req.session.user = user;
    return res.redirect("/");
  } catch (err) {
    console.error("Login Error:", err);
    error = "An unexpected error occurred. Please try again later.";
    res.render("auth/login", { error });
  }
});

// Render Register Page
router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/"); // Redirect logged-in users to home
  }
  res.render("auth/register", { error: null });
});

// Handle Registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let error = null;

  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      error = "Passwords do not match.";
      return res.render("auth/register", { error });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      error = "User already exists with this email.";
      return res.render("auth/register", { error });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Redirect to login on successful registration
    res.redirect("/login");
  } catch (err) {
    console.error("Registration Error:", err);
    error = "An unexpected error occurred. Please try again later.";
    res.render("auth/register", { error });
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.user = null; // Clear the user session
  res.redirect("/"); // Redirect to home
});

module.exports = router;
