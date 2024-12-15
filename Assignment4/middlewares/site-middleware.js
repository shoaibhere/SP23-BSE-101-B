module.exports = async function (req, res, next) {
  try {
    // Check if the session contains a user
    if (req.session && req.session.user) {
      // Attach user to the request object
      req.user = req.session.user;

      // Attach user to res.locals for access in EJS templates
      res.locals.user = req.session.user;
    } else {
      // If no user is logged in, ensure locals are cleared
      req.user = null;
      res.locals.user = null;
    }

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Error in site middleware:", err);
    next(err); // Pass the error to the error-handling middleware
  }
};
