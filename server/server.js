const express = require("express");
const menuRoutes = require("./routes/menu");
const productRoutes = require("./routes/products");

const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/menu", menuRoutes);
app.use("/api/products", productRoutes);

// Basic route untuk testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Coffee Shop API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
