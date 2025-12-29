import express from "express";
import Content from "../models/Content.js";
import { translateText } from "../services/translateService.js";

const router = express.Router();
const LANGUAGES = ["fr", "de", "nl", "zu"];

router.post("/", async (req, res) => {
  try {
    const { key, page, text } = req.body;

    if (!key || !page || !text) {
      return res.status(400).json({
        success: false,
        message: "key, page and text are required",
      });
    }

    // Save EN immediately
    const saved = await Content.findOneAndUpdate(
      { key },
      {
        key,
        page,
        translations: { en: text },
        status: "pending",
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // respond immediately
    res.json({ success: true });

    // 🔥 BACKGROUND TRANSLATION (SAFE)
    setTimeout(async () => {
      try {
        const content = await Content.findById(saved._id);
        if (!content) return;

        for (const lang of LANGUAGES) {
          const translated = await translateText(text, lang);
          if (translated) {
            content.translations[lang] = translated;
          }
        }

        content.status = "translated";
        await content.save();
        console.log("✅ Translation completed for:", key);
      } catch (err) {
        console.error("❌ Translation background error:", err);
      }
    }, 0);

  } catch (err) {
    console.error("Admin content error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
