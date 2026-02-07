import express from "express";
import {
  addProduct,
  updateProduct,
  removeProduct,
  listProducts,
} from "../controller/productAdminController.js";

import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * ADMIN: LIST PRODUCTS
 * GET /api/admin/products
 */
router.get("/products", requireAdmin, listProducts);

/**
 * ADMIN: ADD PRODUCT
 * POST /api/admin/products
 */
router.post("/products", requireAdmin, addProduct);

/**
 * ADMIN: UPDATE PRODUCT
 * PUT /api/admin/products/:id
 */
router.put("/products/:id", requireAdmin, updateProduct);

/**
 * ADMIN: REMOVE PRODUCT
 * DELETE /api/admin/products/:id
 */
router.delete("/products/:id", requireAdmin, removeProduct);

export default router;
