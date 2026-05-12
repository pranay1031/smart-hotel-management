import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Smart Hotel",
      "book_now": "Book Now",
      "room_service": "Room Service"
    }
  },
  hi: {
    translation: {
      "welcome": "स्मार्ट होटल में आपका स्वागत है",
      "book_now": "अभी बुक करें",
      "room_service": "रुम सर्विस"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
