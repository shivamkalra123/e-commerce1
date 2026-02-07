import express from "express";
import {
  createCategory,
  addSubcategory,
  updateCategory,
  deleteCategory,
  deleteSubcategory,
} from "../controller/categoryAdminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// 🔐 Admin-only
router.post("/categories", requireAdmin, createCategory);

router.post(
  "/categories/:id/subcategories",
  requireAdmin,
  (req, res) =>
    addSubcategory(req.db, req, process.env, req.params.id)
);

router.put(
  "/categories/:id",
  requireAdmin,
  (req, res) =>
    updateCategory(req.db, req, process.env, req.params.id)
);

router.delete(
  "/categories/:id",
  requireAdmin,
  (req, res) =>
    deleteCategory(req.db, req, process.env, req.params.id)
);

router.delete(
  "/categories/:id/subcategories/:sub",
  requireAdmin,
  (req, res) =>
    deleteSubcategory(
      req.db,
      req,
      process.env,
      req.params.id,
      req.params.sub
    )
);

export default router;
