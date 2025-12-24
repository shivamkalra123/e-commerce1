import express from "express";
import { getProductReviews, addReview } from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", auth, addReview);

export default router;
