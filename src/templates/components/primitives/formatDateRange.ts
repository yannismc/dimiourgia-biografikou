import dayjs from 'dayjs';
import 'dayjs/locale/el';
import type { ResumeDate } from '../types';

export type DateLocale = 'en' | 'el';

export function formatDate(
  value: ResumeDate,
  locale: DateLocale = 'en',
  yearOnly = false
): string {
  if (!value) return '';
  const date = dayjs(value);
  return date.isValid() ? date.locale(locale).format(yearOnly ? 'YYYY' : 'MMM YYYY') : '';
}
export function formatDateRange(
  start: ResumeDate,
  end: ResumeDate,
  isCurrent = false,
  locale: DateLocale = 'en',
  yearOnly = false
) {
  const s = formatDate(start, locale, yearOnly);
  const e = isCurrent
    ? locale === 'el'
      ? 'Σήμερα'
      : 'Present'
    : formatDate(end, locale, yearOnly);
  return [s, e].filter(Boolean).join(' – ');
}
