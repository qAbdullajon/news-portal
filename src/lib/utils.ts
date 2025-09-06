import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/translations.ts
const translations = {
  uz: {
    title: "Yangiliklar portali",
    readMore: "Ko'proq o'qish",
    home: "Bosh sahifa",
    news: "Yangiliklar",
    categories: "Kategoriyalar",
    about: "Biz haqimizda",
    contact: "Aloqa",
  },
  ru: {
    title: "Новостной портал",
    readMore: "Читать далее",
    home: "Главная",
    news: "Новости",
    categories: "Категории",
    about: "О нас",
    contact: "Контакты",
  },
  en: {
    title: "News portal",
    readMore: "Read more",
    home: "Home",
    news: "News",
    categories: "Categories",
    about: "About us",
    contact: "Contact",
  },
};

export function useTranslations(lang: "uz" | "ru" | "en") {
  return function t(key: keyof typeof translations.uz) {
    return translations[lang][key] || key;
  };
}
