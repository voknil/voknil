'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ruTranslations from '../locales/ru';
import enTranslations from '../locales/en';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsMap = {
  ru: ruTranslations,
  en: enTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');
  const [translations, setTranslations] = useState<any>(ruTranslations);

  useEffect(() => {
    // Загружаем язык из localStorage при монтировании (только на клиенте)
    if (typeof window !== 'undefined') {
      const savedLang = (localStorage.getItem('language') as Language) || 'ru';
      setLanguageState(savedLang);
      setTranslations(translationsMap[savedLang]);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(translationsMap[lang]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
