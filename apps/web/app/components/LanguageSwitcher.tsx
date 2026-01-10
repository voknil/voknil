'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-2">
      <button
        onClick={() => setLanguage('ru')}
        className={`px-4 py-2 rounded-full glass text-sm font-medium transition-all duration-300 ${
          language === 'ru'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full glass text-sm font-medium transition-all duration-300 ${
          language === 'en'
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
    </div>
  );
}
