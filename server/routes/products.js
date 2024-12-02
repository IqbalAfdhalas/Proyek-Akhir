// routes/products.js
const express = require("express");
const router = express.Router();
const { productController } = require("../controllers/productController");
const auth = require("../middleware/auth");

// Public routes
router.get("/active", productController.getActiveProducts);

// Protected routes
router.get("/", auth, productController.getAllProducts);
router.get("/:id", auth, productController.getProductById);
router.post("/", auth, productController.createProduct);
router.put("/:id", auth, productController.updateProduct);
router.delete("/soft/:id", auth, productController.softDeleteProduct);
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
