import { MenuItem } from '@mui/material';
import { useEffect } from 'react';

import { useSectionLayoutStore } from '@/stores/useSectionLayoutStore';
import { useResumeLanguageStore } from '@/stores/useResumeLanguageStore';

import { StyledButton } from '../atoms';

const PRINT_MESSAGES = {
  en: {
    download: 'Download as PDF',
    pending:
      'The CV layout is still loading. Wait for fonts and page layout to finish, then try again.',
    overflow:
      'The CV does not fit on two pages. Shorten the text or move sections between pages, then try again. No PDF was printed.',
  },
  el: {
    download: 'Λήψη PDF',
    pending:
      'Η διάταξη του βιογραφικού φορτώνεται ακόμη. Περιμένετε να ολοκληρωθεί η φόρτωση των γραμματοσειρών και των σελίδων και δοκιμάστε ξανά.',
    overflow:
      'Το βιογραφικό δεν χωράει σε δύο σελίδες. Συντομεύστε το κείμενο ή μετακινήστε ενότητες μεταξύ των σελίδων και δοκιμάστε ξανά. Δεν εκτυπώθηκε PDF.',
  },
  fr: {
    download: 'Télécharger le PDF',
    pending:
      'La mise en page du CV est en cours. Attendez le chargement des polices et la fin de la mise en page, puis réessayez.',
    overflow:
      'Le CV dépasse deux pages. Raccourcissez le texte ou répartissez les rubriques entre les pages, puis réessayez. Aucun PDF n’a été imprimé.',
  },
  de: {
    download: 'Als PDF herunterladen',
    pending:
      'Das Layout des Lebenslaufs wird noch geladen. Warten Sie, bis die Schriftarten und das Seitenlayout bereit sind, und versuchen Sie es erneut.',
    overflow:
      'Der Lebenslauf passt nicht auf zwei Seiten. Kürzen Sie den Text oder verschieben Sie Abschnitte zwischen den Seiten und versuchen Sie es erneut. Es wurde kein PDF gedruckt.',
  },
} as const;

export const PrintResume: React.FC<{ isMenuButton?: boolean }> = ({ isMenuButton }) => {
  const language = useResumeLanguageStore((state) => state.language);
  const messages = PRINT_MESSAGES[language];
  useEffect(() => {
    const beforePrint = () => {
      globalThis.document.title = `Resume_Builder_${Date.now()}`;
      const { isReorderMode, setReorderMode } = useSectionLayoutStore.getState();
      if (isReorderMode) setReorderMode(false);
    };

    const afterPrint = () => {
      globalThis.document.title = 'Single Page Resume Builder';
    };

    globalThis?.addEventListener('beforeprint', beforePrint);
    globalThis?.addEventListener('afterprint', afterPrint);

    return () => {
      globalThis?.removeEventListener('beforeprint', beforePrint);
      globalThis?.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const runPrint = async () => {
    const { isReorderMode, setReorderMode } = useSectionLayoutStore.getState();
    const hasAcademicPages = document.querySelector('[data-cv-fit-state]') !== null;
    if (isReorderMode) setReorderMode(false);
    if (hasAcademicPages) await document.fonts?.ready;
    if (isReorderMode || hasAcademicPages) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    }
    const pages = [...document.querySelectorAll<HTMLElement>('[data-cv-fit-state]')];
    if (pages.some((page) => page.dataset.cvFitState === 'overflow')) {
      globalThis.alert(messages.overflow);
      return;
    }
    if (pages.some((page) => page.dataset.cvFitState !== 'ready')) {
      globalThis.alert(messages.pending);
      return;
    }
    globalThis?.print?.();
  };

  if (isMenuButton) {
    return <MenuItem onClick={runPrint}>{messages.download}</MenuItem>;
  }

  return (
    <StyledButton onClick={runPrint} variant="outlined">
      {messages.download}
    </StyledButton>
  );
};
