const express = require("express");
let router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/login", { error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let error = null;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      error = "User does not exist.";
      return res.render("auth/login", { error });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      error = "Incorrect password.";
      return res.render("auth/login", { error });
    }

    req.session.user = user;
    return res.redirect("/");
  } catch (err) {
    console.error("Login Error:", err);
    error = "An unexpected error occurred. Please try again later.";
    res.render("auth/login", { error });
  }
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("auth/register", { error: null });
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  let error = null;

  try {
    if (password !== confirmPassword) {
      error = "Passwords do not match.";
      return res.render("auth/register", { error });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      error = "User already exists with this email.";
      return res.render("auth/register", { error });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Registration Error:", err);
    error = "An unexpected error occurred. Please try again later.";
    res.render("auth/register", { error });
  }
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = router;
