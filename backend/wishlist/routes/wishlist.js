import express from "express";
import Wishlist from "../models/Wishlist.js";
import mongoose from "mongoose";

const router = express.Router();

/* ---------------- GET WISHLIST ---------------- */

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [] });
    }

    res.json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* ---------------- TOGGLE ---------------- */

router.post("/toggle", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ success: false });

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [],
      });
    }

    const pid = new mongoose.Types.ObjectId(productId);

    const exists = wishlist.products.some((p) => p.equals(pid));

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (p) => !p.equals(pid)
      );
    } else {
      wishlist.products.push(pid);
    }

    await wishlist.save();

    res.json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
