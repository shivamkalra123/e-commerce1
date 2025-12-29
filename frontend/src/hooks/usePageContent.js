import { useEffect, useState } from "react";

export const usePageContent = (page) => {
  const [content, setContent] = useState({});
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "en"
  );

  useEffect(() => {
    const handler = () =>
      setLang(localStorage.getItem("lang") || "en");

    window.addEventListener("languageChanged", handler);
    return () =>
      window.removeEventListener("languageChanged", handler);
  }, []);

  useEffect(() => {
    fetch(`/api/content?page=${page}&lang=${lang}`)
      .then(res => res.json())
      .then(setContent);
  }, [page, lang]);

  return content;
};
