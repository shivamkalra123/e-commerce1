import { i18n } from "@lingui/core";

// ✅ import the whole module
import * as en from "./locales/en/messages";
import * as de from "./locales/de/messages";
import * as fr from "./locales/fr/messages";
import * as nl from "./locales/nl/messages";
import * as zu from "./locales/zu/messages";


// ✅ load messages
i18n.load({
  en: en.messages,
  de: de.messages,
  fr:fr.messages,
  nl:nl.messages,
  zu:zu.messages
});

// 🔴 force German just to test
const savedLang = localStorage.getItem("lang") || "en";
i18n.activate(savedLang);


export { i18n };
