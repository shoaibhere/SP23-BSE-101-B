const express = require('express');
let router = express.Router();
const adminProductsRouter = require("./product.controller");
router.use("/products", adminProductsRouter);

const ordersRouter = require("./order.controller");
router.use("/orders", ordersRouter);

const brandController = require("./brand.controller");
router.use("/brands", brandController);

const categoryController = require("./category.controller");
router.use("/categories",categoryController);

module.exports = router;