import Content from "../models/Content.js";
import { translateText } from "./translateService.js";

const LANGS = ["fr", "de", "nl", "zu"];

export async function translateAndSave(contentId) {
  const content = await Content.findById(contentId);
  if (!content) return;

  const baseText = content.translations.en;

  for (const lang of LANGS) {
    if (!content.translations[lang]) {
      try {
        content.translations[lang] =
          await translateText(baseText, lang);
      } catch (err) {
        console.error("Translation failed:", lang, err);
      }
    }
  }

  content.status = "translated";
  await content.save();
}
