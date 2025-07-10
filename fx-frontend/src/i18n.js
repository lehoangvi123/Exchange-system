import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      updateSettings: "Update User Settings",
      email: "Email",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      language: "Language",
      notifications: "Receive Notifications",
      submit: "Update",
      success: "✅ Preferences updated successfully!",
    },
  },
  vi: {
    translation: {
      updateSettings: "⚙️ Cập nhật Cài đặt Người dùng",
      email: "Email",
      theme: "Giao diện",
      light: "Sáng",
      dark: "Tối",
      language: "Ngôn ngữ",
      notifications: "Nhận thông báo",
      submit: "Cập nhật",
      success: "✅ Cập nhật cài đặt thành công!",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // 👈 Rất quan trọng
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
