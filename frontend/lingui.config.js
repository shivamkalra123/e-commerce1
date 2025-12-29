/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "de", "fr", "nl", "zu"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  compileNamespace: "es",
  format: "po",
};
