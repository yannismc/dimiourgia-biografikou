import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const STORAGE_KEY = 'resumeSectionLayouts';

type SectionLayoutByTemplate = Record<string, Record<string, string[]>>;
type SectionVisibility = Record<string, boolean>;

type SectionLayoutState = {
  layouts: SectionLayoutByTemplate;
  sectionVisibility: SectionVisibility;
  isReorderMode: boolean;
  setLayout: (templateId: string, regions: Record<string, string[]>) => void;
  setSectionVisibility: (sectionId: string, isVisible: boolean) => void;
  isSectionVisible: (sectionId: string) => boolean;
  setReorderMode: (enabled: boolean) => void;
  toggleReorderMode: () => void;
  resetTemplate: (templateId: string) => void;
  resetAll: () => void;
};

export const useSectionLayoutStore = create<SectionLayoutState>()(
  persist(
    (set, get) => ({
      layouts: {},
      sectionVisibility: {},
      isReorderMode: false,
      setLayout: (templateId, regions) =>
        set((s) => ({
          layouts: { ...s.layouts, [templateId]: regions },
        })),
      setSectionVisibility: (sectionId, isVisible) =>
        set((s) => ({
          sectionVisibility: { ...s.sectionVisibility, [sectionId]: isVisible },
        })),
      isSectionVisible: (sectionId) => get().sectionVisibility[sectionId] !== false,
      setReorderMode: (enabled) => set({ isReorderMode: enabled }),
      toggleReorderMode: () => set((s) => ({ isReorderMode: !s.isReorderMode })),
      resetTemplate: (templateId) =>
        set((s) => {
          const next = { ...s.layouts };
          delete next[templateId];
          return { layouts: next };
        }),
      resetAll: () => set({ layouts: {}, sectionVisibility: {}, isReorderMode: false }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        layouts: state.layouts,
        sectionVisibility: state.sectionVisibility,
        isReorderMode: state.isReorderMode,
      }),
    }
  )
);
