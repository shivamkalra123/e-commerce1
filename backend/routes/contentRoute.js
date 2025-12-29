import express from "express";
import Content from "../models/Content.js";

const router = express.Router();

/**
 * GET /api/content?page=navbar&lang=en
 * Returns key-value map of translated content
 */
router.get("/", async (req, res) => {
  try {
    const { page, lang = "en" } = req.query;

    if (!page) {
      return res.status(400).json({
        success: false,
        message: "Page query parameter is required",
      });
    }

    const contents = await Content.find({ page });

    const response = {};
    contents.forEach((item) => {
      response[item.key] =
        item.translations?.[lang] || item.translations?.en || "";
    });

    res.json(response);
  } catch (error) {
    console.error("Content fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
});

export default router;
