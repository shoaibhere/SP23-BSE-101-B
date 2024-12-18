module.exports = async function (req, res, next) {
  try {
    if (req.session && req.session.user) {
      req.user = req.session.user;

      res.locals.user = req.session.user;
    } else {
      req.user = null;
      res.locals.user = null;
    }

    next(); 
  } catch (err) {
    console.error("Error in site middleware:", err);
    next(err);
  }
};
