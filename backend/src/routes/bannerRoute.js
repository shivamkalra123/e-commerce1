import express from "express";
import { getBanner, createBanner, deleteBanner } from "../controllers/bannerController.js";
import authUser from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// public – get all banners
router.get("/", getBanner);

// admin – create NEW banner
router.post("/", authUser, upload.single("image"), createBanner);

// admin – delete specific banner
router.delete("/:id", authUser, deleteBanner);

export default router;
