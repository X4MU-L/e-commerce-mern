const express = require("express");

// Import all your route files
const authRoutes = require("./Auth");
const productRoutes = require("./Product");
const orderRoutes = require("./Order");
const cartRoutes = require("./Cart");
const brandRoutes = require("./Brand");
const categoryRoutes = require("./Category");
const userRoutes = require("./User");
const addressRoutes = require("./Address");
const reviewRoutes = require("./Review");
const wishlistRoutes = require("./Wishlist");

const router = express.Router();

// routeMiddleware
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/address", addressRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlist", wishlistRoutes);

// API health check
router.get("/health", (req, res) => {
  res.status(200).json({ message: "API running" });
});

module.exports = router;
