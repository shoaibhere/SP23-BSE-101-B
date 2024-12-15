module.exports = async function (req, res, next) {
  if (req.session.user?.role===("customer")) return res.redirect("/login");
  else next();
};
