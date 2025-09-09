'use client';

import { Language } from '@/types/type';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface NewsContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    adminHeaderTitle: string;
    setAdminHeaderTitle: (text: string) => void;
    isAuth: boolean;
    setIsAuth: (bool: boolean) => void
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsPortalProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuth] = useState(false)
    const [language, setLanguage] = useState<Language | undefined>(undefined);
    const [adminHeaderTitle, setAdminHeaderTitle] = useState("Barcha yangiliklar")

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
                setLanguage(savedLanguage);
            } else {
                const browserLang = navigator.language.split('-')[0];
                if (browserLang === 'ru') setLanguage('ru');
                else if (browserLang === 'en') setLanguage('en');
                else setLanguage('uz');
            }
        }
    }, []);

    // Til o'zgarganda saqlash
    useEffect(() => {
        if (typeof window !== 'undefined' && language) {
            localStorage.setItem('language', language);
            document.documentElement.lang = language;
        }
    }, [language]);

    const value = {
        language: language as Language,
        setLanguage: (lang: Language) => setLanguage(lang),
        adminHeaderTitle,
        setAdminHeaderTitle,
        isAuth,
        setIsAuth
    };

    if (!language) return null; // yoki loading

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(NewsContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}