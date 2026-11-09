import { create } from 'zustand';

export type ResumeLanguage = 'en' | 'el' | 'fr' | 'de';
export const isResumeLanguage = (value: unknown): value is ResumeLanguage =>
  ['en', 'el', 'fr', 'de'].includes(value as string);

const STORAGE_KEY = 'resumeDocumentLanguage';
export const useResumeLanguageStore = create<{
  language: ResumeLanguage;
  hydrated: boolean;
  hydrate: () => void;
  setLanguage: (language: ResumeLanguage) => void;
}>((set, get) => ({
  language: 'en',
  hydrated: false,
  hydrate: () => {
    if (get().hydrated || typeof window === 'undefined') return;
    let language: ResumeLanguage = 'en';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isResumeLanguage(saved)) language = saved;
    } catch {
      /* In-memory editing remains available without storage. */
    }
    set({ language, hydrated: true });
  },
  setLanguage: (language) => {
    set({ language, hydrated: true });
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* Storage is optional. */
    }
  },
}));
