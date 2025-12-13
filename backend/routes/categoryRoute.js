import express from "express";
import auth from "../middleware/auth.js";
import * as ctrl from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", ctrl.getAll);
router.post("/", auth, ctrl.createCategory);
router.post("/:id/subcategories", auth, ctrl.addSubcategory);
router.put("/:id", auth, ctrl.updateCategory);
router.delete("/:id", auth, ctrl.deleteCategory);
router.delete("/:id/subcategories/:sub", auth, ctrl.deleteSubcategory);

export default router;
