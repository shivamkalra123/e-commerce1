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

// ✅ GET categories (ADMIN)
router.get("/categories", requireAdmin, getCategories);

// ✅ CREATE category
router.post("/categories", requireAdmin, createCategory);

// ✅ ADD subcategories
router.post(
  "/categories/:id/subcategories",
  requireAdmin,
  addSubcategory
);

// ✅ UPDATE category
router.put("/categories/:id", requireAdmin, updateCategory);

// ✅ DELETE category
router.delete("/categories/:id", requireAdmin, deleteCategory);

// ✅ DELETE subcategory
router.delete(
  "/categories/:id/subcategories/:sub",
  requireAdmin,
  deleteSubcategory
);

export default router;
