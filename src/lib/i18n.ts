import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uz: {
    translation: {
      "brand.name": "Faxr Mebel",
      "nav.home": "Bosh Sahifa",
      "nav.shop": "Do'kon",
      "nav.categories": "Kategoriyalar",
      "nav.about": "Biz Haqimizda",
      "nav.contact": "Aloqa",
      "hero.title": "Faxr Mebel – Chiroyli Hayot Uchun Zamonaviy Mebel",
      "hero.subtitle": "Hashamatli qulaylik va zamonaviy interyerlar olamiga xush kelibsiz. Bizning kolleksiyamiz sizning uyingizga nafislik olib kiradi.",
      "cta.buy": "Hozir Sotib Oling",
      "cta.shop": "Kolleksiyani Ko'rish",
      "cta.contact": "Biz Bilan Bog'laning",
      "section.featured": "Tanlangan Mahsulotlar",
      "section.categories": "Kategoriyalar",
      "why.title": "Nima uchun Faxr Mebel?",
      "why.delivery": "Tezkor yetkazib berish",
      "why.quality": "Premium sifatli materiallar",
      "why.design": "Zamonaviy hashamatli dizaynlar",
      "theme.light": "Yorug' rejim",
      "theme.dark": "Tungi rejim"
    }
  },
  ru: {
    translation: {
      "brand.name": "Faxr Mebel",
      "nav.home": "Главная",
      "nav.shop": "Магазин",
      "nav.categories": "Категории",
      "nav.about": "О нас",
      "nav.contact": "Контакты",
      "hero.title": "Faxr Mebel – Современная мебель для элегантной жизни",
      "hero.subtitle": "Добро пожаловать в мир роскошного комфорта и стильных интерьеров. Наша коллекция принесет изысканность в ваш дом.",
      "cta.buy": "Купить сейчас",
      "cta.shop": "Посмотреть коллекцию",
      "cta.contact": "Связаться с нами",
      "section.featured": "Популярные товары",
      "section.categories": "Категории",
      "why.title": "Почему Faxr Mebel?",
      "why.delivery": "Быстрая доставка",
      "why.quality": "Материалы премиум-качества",
      "why.design": "Современный роскошный дизайн",
      "theme.light": "Светлая тема",
      "theme.dark": "Темная тема"
    }
  },
  en: {
    translation: {
      "brand.name": "Faxr Mebel",
      "nav.home": "Home",
      "nav.shop": "Shop",
      "nav.categories": "Categories",
      "nav.about": "About Us",
      "nav.contact": "Contact",
      "hero.title": "Faxr Mebel – Modern Furniture For Elegant Living",
      "hero.subtitle": "Welcome to the world of luxury comfort and stylish interiors. Our collection brings elegance to your home.",
      "cta.buy": "Buy Now",
      "cta.shop": "Shop Collection",
      "cta.contact": "Contact Us",
      "section.featured": "Featured Products",
      "section.categories": "Categories",
      "why.title": "Why Choose Faxr Mebel?",
      "why.delivery": "Fast delivery",
      "why.quality": "Premium quality materials",
      "why.design": "Modern luxury designs",
      "theme.light": "Light Mode",
      "theme.dark": "Dark Mode"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
