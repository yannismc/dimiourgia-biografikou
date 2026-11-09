import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  ACADEMIC_LABELS,
  academicDate,
  academicDateRange,
  academicFooter,
} from './academicCvLocale';
import { fitAcademicPage, MIN_ACADEMIC_SCALE } from './academicPageFit';
import { isResearchExperience } from '../registry/predicates';
import { applyImportedResumeJson } from '@/modules/builder/nav-bar/applyImportedResume';
import { exportResumeMetadata } from '@/modules/builder/nav-bar/resumeMetadata';
import { useSectionTitleStore } from '@/stores/useSectionTitleStore';
import { useResumeLanguageStore } from '@/stores/useResumeLanguageStore';

dayjs.extend(utc);

describe('academic CV localization and import', () => {
  it.each(['en', 'el', 'fr', 'de'] as const)(
    'round trips %s headings and document language',
    (language) => {
      const labels = ACADEMIC_LABELS[language];
      const metadata = {
        ...exportResumeMetadata(),
        template: { id: 'academic-cv', name: 'Academic CV' },
        language,
        titles: { summary: labels.summary, work: labels.work },
        layout: { page1: ['summary'], page2: ['work'] },
      };
      applyImportedResumeJson({ basics: { name: 'Test Person' }, __metadata: metadata });
      expect(exportResumeMetadata()).toEqual(metadata);
      expect(useSectionTitleStore.getState().titles['academic-cv'].summary).toBe(labels.summary);
      useResumeLanguageStore.setState({ language: 'en', hydrated: false });
      useResumeLanguageStore.getState().hydrate();
      expect(useResumeLanguageStore.getState().language).toBe(language);
      expect(academicFooter('Test', 2, language)).toContain(`${labels.page} 2 ${labels.of} 2`);
    }
  );
  it('keeps uncertain year-only dates and translates known months and ongoing dates', () => {
    expect(academicDateRange('2010', '2012', false, 'fr')).toBe('2010 – 2012');
    expect(academicDateRange('2021-08', '2022-02', false, 'fr')).toBe('août 2021 – févr. 2022');
    expect(academicDateRange('2021-08', null, true, 'de')).toBe('Aug. 2021 – Heute');
  });
  it('preserves the picker calendar month at Athens midnight across the UTC date boundary', () => {
    const january = dayjs('2023-01-01T00:00:00+02:00').utcOffset(120);
    expect(january.toISOString()).toBe('2022-12-31T22:00:00.000Z');
    expect(academicDate(january, 'en')).toBe('Jan 2023');
    expect(academicDate(january, 'fr')).toBe('janv. 2023');
    expect(academicDate(dayjs('invalid'), 'en')).toBe('');
  });
  it('resets only the document language when a legacy resume without metadata is imported', () => {
    useResumeLanguageStore.getState().setLanguage('de');
    const before = exportResumeMetadata();
    applyImportedResumeJson({ basics: { name: 'Legacy resume' } });
    expect(exportResumeMetadata()).toEqual({ ...before, language: 'en' });
  });
  it('keeps generic labels generic until resume metadata supplies a specific override', () => {
    expect(ACADEMIC_LABELS.en.awards).toBe('Awards, Grants & Funding');
    expect(ACADEMIC_LABELS.en.technologies).toBe('Technologies');
    expect(ACADEMIC_LABELS.de.technologies).toBe('Technologien');
  });
  it.each([
    'TEI d’Athènes — Laboratoire des énergies renouvelables | Grèce',
    'TEI Athen — Labor für erneuerbare Energien | Griechenland',
    'TEI of Athens',
    'ΤΕΙ Αθηνών',
  ])('recognizes translated research institution %s', (name) => {
    expect(isResearchExperience({ name, position: 'Stage' })).toBe(true);
  });
});

describe('academic page fitting', () => {
  it('restores full scale when the content fits', () => {
    expect(fitAcademicPage(900, () => 700)).toEqual({ scale: 1, overflow: 0, ready: true });
  });
  it('finds the largest fitting readable scale with changing line wraps', () => {
    const result = fitAcademicPage(900, (scale) => 950 * scale + (scale > 0.94 ? 35 : 0));
    expect(result.scale).toBeLessThanOrEqual(0.94);
    expect(result.scale).toBeGreaterThan(0.939);
    expect(result.overflow).toBe(0);
  });
  it('reports oversized content instead of shrinking below the readability floor', () => {
    expect(fitAcademicPage(900, (scale) => 1300 * scale)).toEqual({
      scale: MIN_ACADEMIC_SCALE,
      overflow: 218,
      ready: true,
    });
  });
  it('does not claim readiness before page dimensions exist', () => {
    expect(fitAcademicPage(0, () => 1000).ready).toBe(false);
  });
});
