import express from "express";
import { ObjectId } from "mongodb";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * ADMIN: Get all orders
 * GET /api/admin/orders
 */
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await req.db
      .collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();

    res.json({ success: true, orders });
  } catch (err) {
    console.error("allOrders error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * ADMIN: Update order status
 * PUT /api/admin/orders/status
 */
router.put("/orders/status", requireAdmin, async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status required",
      });
    }

    await req.db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: String(status) } }
    );

    res.json({ success: true, message: "Status Updated" });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
