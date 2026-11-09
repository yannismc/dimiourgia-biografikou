import { createContext } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import fixture from '@/templates/test-fixtures/resume-data.json';
import { useResumeLanguageStore } from '@/stores/useResumeLanguageStore';
import { useSectionTitleStore } from '@/stores/useSectionTitleStore';
import { ACADEMIC_LABELS } from './academicCvLocale';

vi.mock('@/modules/builder/resume/ResumeLayout', () => ({ StateContext: createContext(null) }));
vi.mock('@/helpers/section-layout', () => ({
  useSectionLayoutRuntime: () => ({
    regions: { page1: ['summary', 'education'], page2: ['work', 'languages'] },
  }),
}));
vi.mock('@/templates/designs/integration/TemplateRegion', () => ({
  TemplateRegion: ({
    items,
    renderSection,
  }: {
    items: string[];
    renderSection: (id: string) => React.ReactNode;
  }) => (
    <>
      {items.map((id) => (
        <div key={id}>{renderSection(id)}</div>
      ))}
    </>
  ),
}));
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import AcademicCvTemplate from './AcademicCvTemplate';

const theme = Object.assign(createTheme(), {
  backgroundColor: '#fff',
  fontColor: '#111',
  titleColor: '#123456',
  highlighterColor: '#123456',
});
const data = {
  ...fixture,
  basics: { ...fixture.basics, summary: '<p>Profile content</p>' },
  skills: { ...fixture.skills, languages: [{ name: 'Greek', level: 100 }] },
};
const documentView = (resume = data) => (
  <StateContext.Provider value={resume}>
    <ThemeProvider theme={theme}>
      <AcademicCvTemplate />
    </ThemeProvider>
  </StateContext.Provider>
);

afterEach(() => vi.restoreAllMocks());

describe('academic document output', () => {
  it('shows the supplied Athens residence without inferring a current affiliation or absent contacts', () => {
    useResumeLanguageStore.setState({ language: 'el', hydrated: true });
    const resume = {
      ...data,
      basics: {
        ...data.basics,
        phone: '',
        email: '',
        url: 'https://example.com/',
        location: { ...data.basics.location, city: 'Αθήνα' },
      },
    };
    const view = render(documentView(resume));
    const header = view.container.querySelector('.academic-cv-header')!;
    const contact = header.querySelector('.academic-cv-contact')!;
    expect(contact.textContent).toBe('Αθήνα|example.com');
    expect(header.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(header).not.toHaveTextContent('τηλ.');
    expect(header).not.toHaveTextContent(data.education[0].institution);
    view.rerender(
      documentView({
        ...resume,
        basics: { ...resume.basics, location: { ...resume.basics.location, city: '' } },
      })
    );
    expect(header.querySelector('.academic-cv-contact')?.textContent).toBe('example.com');
    expect(header.querySelector('.academic-cv-contact-separator')).toBeNull();
    view.unmount();
  });
  it.each(['en', 'el', 'fr', 'de'] as const)(
    'renders localized %s labels and honors imported title overrides',
    (language) => {
      useResumeLanguageStore.setState({ language, hydrated: true });
      useSectionTitleStore.setState({
        titles: { 'academic-cv': { summary: 'Custom profile' } },
        hydrated: true,
      });
      const view = render(documentView());
      const labels = ACADEMIC_LABELS[language];
      expect(screen.getByRole('heading', { name: 'Custom profile' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: labels.education })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: labels.work })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: labels.languages })).toBeInTheDocument();
      expect(view.container.querySelector('.academic-cv-language-line')).toHaveTextContent(
        labels.native
      );
      expect(view.container.querySelectorAll('.academic-cv-footer')[1]).toHaveTextContent(
        `${labels.page} 2 ${labels.of} 2`
      );
      view.unmount();
    }
  );

  it('waits for fonts and rechecks later font/layout changes without clipping oversized content', async () => {
    const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
    let finishFonts!: () => void;
    let fontLoaded = () => {};
    const fonts = {
      status: 'loading',
      ready: new Promise<void>((resolve) => {
        finishFonts = resolve;
      }),
      addEventListener: (_event: string, handler: () => void) => {
        fontLoaded = handler;
      },
      removeEventListener: () => {},
    };
    Object.defineProperty(document, 'fonts', { configurable: true, value: fonts });
    let naturalHeight = 1000;
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(1122);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(15);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(700);
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(700);
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
      this: HTMLElement
    ) {
      return naturalHeight * (Number(this.style.getPropertyValue('--resume-fit-scale')) || 1);
    });
    const computed = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) =>
      element.classList.contains('academic-cv-page')
        ? ({ paddingTop: '56', paddingBottom: '53' } as CSSStyleDeclaration)
        : computed(element)
    );
    const view = render(documentView());
    try {
      expect(view.container.querySelector('[data-cv-fit-state="ready"]')).toBeNull();
      await act(async () => {
        fonts.status = 'loaded';
        finishFonts();
      });
      await waitFor(() =>
        expect(view.container.querySelectorAll('[data-cv-fit-state="ready"]')).toHaveLength(2)
      );
      naturalHeight = 1500;
      act(() => fontLoaded());
      // Both pages register a font callback; browser dispatch calls both. This stub captures the last.
      await waitFor(() =>
        expect(view.container.querySelector('[data-cv-fit-state="overflow"]')).not.toBeNull()
      );
      const overflow = view.container.querySelector<HTMLElement>('[data-cv-fit-state="overflow"]')!;
      expect(overflow.dataset.cvFitScale).toBe('0.86');
      expect(overflow.style.overflow).toBe('visible');
    } finally {
      view.unmount();
      if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
      else Reflect.deleteProperty(document, 'fonts');
    }
  });
});
