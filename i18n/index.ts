import i18next, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./lang/en.json";

const resources: Resource = {
  en: { translation: en },
};

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
