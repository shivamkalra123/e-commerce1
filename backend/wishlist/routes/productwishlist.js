import express from "express";
import Product from "../models/Products.js";
import mongoose from "mongoose";

const router = express.Router();

/* ---------------- GET PRODUCTS BY IDs (BATCH FETCH) ---------------- */

router.post("/by-ids", async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product IDs array is required",
      });
    }

    // Convert string IDs to MongoDB ObjectIds
    const objectIds = productIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (err) {
        return null;
      }
    }).filter(id => id !== null);

    if (objectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product IDs format",
      });
    }

    // Fetch products where _id is in the array
    const products = await Product.find({
      _id: { $in: objectIds }
    });

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (err) {
    console.error("Error fetching products by IDs:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
});

/* ---------------- GET SINGLE PRODUCT BY ID ---------------- */

router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: err.message,
    });
  }
});

export default router;