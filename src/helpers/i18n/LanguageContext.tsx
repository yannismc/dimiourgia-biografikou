'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Locale = 'el' | 'en';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'e-biografiko-locale';

const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return 'el';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'el' || stored === 'en') return stored;
  return 'el';
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = locale === 'el' ? 'E-Resume: Αρχική' : 'E-Resume: Home';
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
