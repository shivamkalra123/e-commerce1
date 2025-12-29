import { i18n } from "@lingui/core";

const LanguageSwitcher = () => {
  const changeLanguage = (lang) => {
    i18n.activate(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      defaultValue={i18n.locale}
      className="text-xs border rounded px-2 py-1 bg-white"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="de">DE</option>
      <option value="nl">NL</option>
      <option value="zu">ZU</option>
    </select>
  );
};

export default LanguageSwitcher;
