import express from "express";
import {
  addProduct,
  updateProduct,
  removeProduct,
  listProducts,
} from "../controller/productAdminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ LIST PRODUCTS (ADMIN)
router.get("/products", requireAdmin, listProducts);

router.post(
  "/products/add",
  requireAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// ✅ UPDATE PRODUCT
router.put("/products/:id", requireAdmin, updateProduct);

// ✅ DELETE PRODUCT
router.delete("/products/:id", requireAdmin, removeProduct);

export default router;
