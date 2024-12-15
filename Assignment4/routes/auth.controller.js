const express = require('express');
let router = express.Router();

// Public Routes (No Authentication Required)
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/"); // Redirect logged-in users to home
  }
  res.render("auth/login");
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/"); // Redirect logged-in users to home
  }
  res.render("auth/register");
});

module.exports = router;
