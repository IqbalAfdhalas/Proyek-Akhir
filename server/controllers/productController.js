// server/controllers/productController.js
const db = require("../config/database");

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM products ORDER BY created_at DESC"
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get active products
  getActiveProducts: async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC"
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single product
  getProductById: async (req, res) => {
    try {
      const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
        req.params.id,
      ]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new product
  createProduct: async (req, res) => {
    const { title, description, price, image_url } = req.body;
    try {
      const [result] = await db.execute(
        "INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)",
        [title, description, price, image_url]
      );
      res.status(201).json({
        message: "Product created successfully",
        id: result.insertId,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update product
  updateProduct: async (req, res) => {
    const { title, description, price, image_url } = req.body;
    try {
      const [result] = await db.execute(
        "UPDATE products SET title = ?, description = ?, price = ?, image_url = ? WHERE id = ?",
        [title, description, price, image_url, req.params.id]
      );
      if (result.affectedRows > 0) {
        res.json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Soft delete product (set is_active to false)
  softDeleteProduct: async (req, res) => {
    try {
      const [result] = await db.execute(
        "UPDATE products SET is_active = false WHERE id = ?",
        [req.params.id]
      );
      if (result.affectedRows > 0) {
        res.json({ message: "Product deactivated successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Hard delete product
  deleteProduct: async (req, res) => {
    try {
      const [result] = await db.execute("DELETE FROM products WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows > 0) {
        res.json({ message: "Product deleted permanently" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

// Hanya ekspor productController
module.exports = { productController };
