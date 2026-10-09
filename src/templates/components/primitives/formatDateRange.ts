import dayjs from 'dayjs';
import 'dayjs/locale/el';
import type { ResumeDate } from '../types';

export type DateLocale = 'en' | 'el';

export function formatDate(value: ResumeDate, locale: DateLocale = 'en'): string {
  if (!value) return '';
  const date = dayjs(value);
  return date.isValid() ? date.locale(locale).format('MMM YYYY') : '';
}
export function formatDateRange(
  start: ResumeDate,
  end: ResumeDate,
  isCurrent = false,
  locale: DateLocale = 'en'
) {
  const s = formatDate(start, locale);
  const e = isCurrent ? (locale === 'el' ? 'Σήμερα' : 'Present') : formatDate(end, locale);
  return [s, e].filter(Boolean).join(' – ');
}
