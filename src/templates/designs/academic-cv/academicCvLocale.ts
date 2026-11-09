import type { ResumeLanguage } from '@/stores/useResumeLanguageStore';
import type { ResumeDate } from '@/templates/components/types';

export const ACADEMIC_LABELS = {
  en: {
    summary: 'Profile',
    research_experience: 'Research Experience',
    education: 'Education',
    work: 'Professional Experience',
    research_interests: 'Research Interests',
    awards: 'Awards, Grants & Funding',
    publications: 'Publications',
    skills: 'Technical Skills',
    languages: 'Languages',
    thesis: 'Thesis',
    frameworks: 'Frameworks',
    technologies: 'Technologies',
    libraries: 'Libraries',
    databases: 'Databases',
    practices: 'Methods',
    tools: 'Tools',
    programming: 'Programming',
    advanced: 'advanced',
    native: 'native',
    fluent: 'professional proficiency',
    intermediate: 'intermediate',
    basic: 'basic',
    phone: 'tel.',
    present: 'Present',
    cv: 'Curriculum Vitae',
    page: 'Page',
    of: 'of',
  },
  el: {
    summary: 'Επαγγελματικό προφίλ',
    research_experience: 'Ερευνητική εμπειρία',
    education: 'Εκπαίδευση',
    work: 'Επαγγελματική εμπειρία',
    research_interests: 'Ερευνητικά ενδιαφέροντα',
    awards: 'Βραβεία, υποτροφίες & χρηματοδότηση',
    publications: 'Δημοσιεύσεις',
    skills: 'Τεχνικές δεξιότητες',
    languages: 'Γλώσσες',
    thesis: 'Εργασία',
    frameworks: 'Πλαίσια ανάπτυξης',
    technologies: 'Τεχνολογίες',
    libraries: 'Βιβλιοθήκες',
    databases: 'Βάσεις δεδομένων',
    practices: 'Μέθοδοι',
    tools: 'Εργαλεία',
    programming: 'Προγραμματισμός',
    advanced: 'προχωρημένο επίπεδο',
    native: 'μητρική',
    fluent: 'επαγγελματική επάρκεια',
    intermediate: 'μέσο επίπεδο',
    basic: 'βασικό επίπεδο',
    phone: 'τηλ.',
    present: 'Σήμερα',
    cv: 'Βιογραφικό σημείωμα',
    page: 'Σελίδα',
    of: 'από',
  },
  fr: {
    summary: 'Profil professionnel',
    research_experience: 'Expérience de recherche',
    education: 'Formation',
    work: 'Expérience professionnelle',
    research_interests: 'Domaines de recherche',
    awards: 'Prix, bourses et financements',
    publications: 'Publications',
    skills: 'Compétences techniques',
    languages: 'Langues',
    thesis: 'Mémoire',
    frameworks: 'Cadres de développement',
    technologies: 'Technologies',
    libraries: 'Bibliothèques',
    databases: 'Bases de données',
    practices: 'Méthodes',
    tools: 'Outils',
    programming: 'Programmation',
    advanced: 'avancé',
    native: 'langue maternelle',
    fluent: 'maîtrise professionnelle',
    intermediate: 'intermédiaire',
    basic: 'notions',
    phone: 'tél.',
    present: 'À ce jour',
    cv: 'Curriculum vitæ',
    page: 'Page',
    of: 'sur',
  },
  de: {
    summary: 'Berufliches Profil',
    research_experience: 'Forschungserfahrung',
    education: 'Studium',
    work: 'Berufserfahrung',
    research_interests: 'Forschungsinteressen',
    awards: 'Auszeichnungen, Stipendien und Fördermittel',
    publications: 'Publikationen',
    skills: 'Fachkenntnisse',
    languages: 'Sprachen',
    thesis: 'Abschlussarbeit',
    frameworks: 'Entwicklungsframeworks',
    technologies: 'Technologien',
    libraries: 'Bibliotheken',
    databases: 'Datenbanken',
    practices: 'Methoden',
    tools: 'Werkzeuge',
    programming: 'Programmierung',
    advanced: 'fortgeschritten',
    native: 'Muttersprache',
    fluent: 'berufliche Sprachkompetenz',
    intermediate: 'Mittelstufe',
    basic: 'Grundkenntnisse',
    phone: 'Tel.',
    present: 'Heute',
    cv: 'Lebenslauf',
    page: 'Seite',
    of: 'von',
  },
} as const;

export function academicDate(value: ResumeDate, language: ResumeLanguage): string {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}$/.test(value)) return value;
  // A picker supplies a calendar date, not an instant: local midnight in Athens
  // must not become the previous month when Intl formats it in UTC.
  const date =
    typeof value === 'string'
      ? new Date(value)
      : value.isValid()
        ? new Date(Date.UTC(value.year(), value.month(), 1))
        : new Date(NaN);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function academicDateRange(
  start: ResumeDate,
  end: ResumeDate,
  current: boolean,
  language: ResumeLanguage
): string {
  return [
    academicDate(start, language),
    current ? ACADEMIC_LABELS[language].present : academicDate(end, language),
  ]
    .filter(Boolean)
    .join(' – ');
}

export function academicFooter(name: string, page: number, language: ResumeLanguage): string {
  const labels = ACADEMIC_LABELS[language];
  return `${name} — ${labels.cv} | ${labels.page} ${page} ${labels.of} 2`;
}
