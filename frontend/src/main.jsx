import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { I18nProvider } from "@lingui/react";
import { i18n } from "./i18n";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1300,          // ⏳ slower animation
  easing: "ease-out-quart", // 🧈 very smooth easing
  once: true,              // animate only once
  offset: 180,             // 🚶 trigger later (lazy feel)
  anchorPlacement: "top-bottom",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nProvider i18n={i18n}>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  </I18nProvider>
);
