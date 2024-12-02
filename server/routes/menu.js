const express = require("express");
const router = express.Router();
const {
  getAllMenu,
  getActiveMenu,
  getMenuById,
  createMenu,
  updateMenu,
  softDeleteMenu,
  deleteMenu,
} = require("../controllers/menuController");
const verifyToken = require("../middleware/auth");

// Public routes
router.get("/active", getActiveMenu);

// Protected routes
router.get("/", verifyToken, getAllMenu);
router.get("/:id", verifyToken, getMenuById);
router.post("/", verifyToken, createMenu);
router.put("/:id", verifyToken, updateMenu);
router.delete("/soft/:id", verifyToken, softDeleteMenu);
router.delete("/:id", verifyToken, deleteMenu);

module.exports = router;
