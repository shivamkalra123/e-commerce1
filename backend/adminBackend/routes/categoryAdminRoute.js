import express from "express";
import {
  getCategories,
  createCategory,
  addSubcategory,
  updateCategory,
  deleteCategory,
  deleteSubcategory,
} from "../controller/categoryAdminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * GET /api/admin/categories
 */
router.get("/categories", requireAdmin, getCategories);

/**
 * POST /api/admin/categories
 */
router.post("/categories", requireAdmin, createCategory);

/**
 * POST /api/admin/categories/:id/subcategories
 */
router.post(
  "/categories/:id/subcategories",
  requireAdmin,
  addSubcategory
);

/**
 * PUT /api/admin/categories/:id
 */
router.put(
  "/categories/:id",
  requireAdmin,
  updateCategory
);

/**
 * DELETE /api/admin/categories/:id
 */
router.delete(
  "/categories/:id",
  requireAdmin,
  deleteCategory
);

/**
 * DELETE /api/admin/categories/:id/subcategories/:sub
 */
router.delete(
  "/categories/:id/subcategories/:sub",
  requireAdmin,
  deleteSubcategory
);

export default router;
