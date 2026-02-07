import express from "express";
import {
  addProduct,
  updateProduct,
  removeProduct,
} from "../controller/productAdminController.js";

import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/products", requireAdmin, addProduct);
router.put("/products/:id", requireAdmin, updateProduct);
router.delete("/products/:id", requireAdmin, removeProduct);

export default router;
