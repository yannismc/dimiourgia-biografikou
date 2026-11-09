import { padding, bodySize } from '@/helpers/resume-style/styles';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { useResumeLanguageStore, type ResumeLanguage } from '@/stores/useResumeLanguageStore';
import { useSectionTitleStore } from '@/stores/useSectionTitleStore';
import {
  ACADEMIC_LABELS,
  academicDate,
  academicDateRange,
  academicFooter,
} from './academicCvLocale';
import { fitAcademicPage } from './academicPageFit';
import type {
  AwardItem,
  EducationItem,
  ExperienceItem,
  SkillItem,
} from '@/templates/components/types';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useSectionLayoutRuntime } from '@/helpers/section-layout';
import { TemplateRegion } from '@/templates/designs/integration/TemplateRegion';
import { pageStyle } from '@/templates/components/primitives/layoutPrimitives';
import { ResumePresentation, useResumePalette } from '@/templates/components/theme';
import { getEducationThesis } from '@/helpers/educationThesis';
import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  isProgrammingLanguage,
  isResearchExperience,
} from '@/templates/designs/registry/predicates';

const BODY = '#111111';
const FONT = "'CV Computer Modern', 'Latin Modern Roman', 'Times New Roman', serif";

function AcademicPage({
  children,
  name,
  pageNumber,
  language,
}: {
  children: ReactNode;
  name: string;
  pageNumber: number;
  language: ResumeLanguage;
}) {
  const palette = useResumePalette();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, overflow: 0, state: 'pending' });

  useLayoutEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    let active = true;
    let frame = 0;
    const fitToPage = () => {
      if (!active) return;
      const computed = window.getComputedStyle(page);
      const verticalPadding =
        Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom);
      const footer = page.querySelector<HTMLElement>('.academic-cv-footer');
      // offsetHeight is unscaled; getBoundingClientRect depends on preview zoom.
      const footerHeight = footer?.offsetHeight ?? 0;
      const availableHeight = page.clientHeight - verticalPadding - footerHeight - 8;
      const result = fitAcademicPage(availableHeight, (scale) => {
        content.style.setProperty('--resume-fit-scale', String(scale));
        return content.scrollHeight;
      });
      content.style.setProperty('--resume-fit-scale', String(result.scale));
      const overflow = Math.max(result.overflow, content.scrollWidth - content.clientWidth);
      const state =
        !result.ready || document.fonts?.status === 'loading'
          ? 'pending'
          : overflow > 1
            ? 'overflow'
            : 'ready';
      setFit((previous) =>
        previous.scale === result.scale &&
        previous.overflow === overflow &&
        previous.state === state
          ? previous
          : { scale: result.scale, overflow, state }
      );
    };
    const scheduleFit = () => {
      if (!active) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitToPage);
    };
    const fontsLoading = () => {
      setFit((previous) => ({ ...previous, state: 'pending' }));
    };
    scheduleFit();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleFit);
    observer?.observe(page);
    observer?.observe(content);
    window.addEventListener('resize', scheduleFit);
    window.addEventListener('beforeprint', fitToPage);
    document.fonts?.ready.then(scheduleFit);
    document.fonts?.addEventListener('loading', fontsLoading);
    document.fonts?.addEventListener('loadingdone', scheduleFit);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', scheduleFit);
      window.removeEventListener('beforeprint', fitToPage);
      document.fonts?.removeEventListener('loading', fontsLoading);
      document.fonts?.removeEventListener('loadingdone', scheduleFit);
    };
  }, [children, language]);

  return (
    <div
      className="resume-a4-page"
      role="region"
      lang={language}
      aria-label={`${ACADEMIC_LABELS[language].page} ${pageNumber}`}
      data-cv-fit-state={fit.state}
      data-cv-fit-scale={fit.scale}
      data-cv-overflow-px={Math.max(0, fit.overflow)}
      style={{ overflow: fit.state === 'overflow' ? 'visible' : undefined }}
    >
      <div
        ref={pageRef}
        className="resume-page-content academic-cv-page"
        style={
          {
            ...pageStyle(palette),
            boxSizing: 'border-box',
            position: 'relative',
            background: '#ffffff',
            color: BODY,
            fontFamily: FONT,
            fontSize: bodySize(11),
            lineHeight: 1.23,
            padding: padding('15mm 16mm 14mm'),
            '--resume-padding': '15mm 16mm 14mm',
            '--resume-line-height': '1.23',
            '--resume-name': '33px',
            '--resume-heading': '16px',
            '--resume-body': '14.55px',
            '--resume-section': '10px',
            '--resume-entry': '7px',
          } as CSSProperties
        }
      >
        <div
          ref={contentRef}
          className="academic-cv-content"
          style={{ '--resume-fit-scale': fit.scale } as CSSProperties}
        >
          {children}
        </div>
        <div className="academic-cv-footer">{academicFooter(name, pageNumber, language)}</div>
      </div>
    </div>
  );
}

function AcademicSection({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`academic-cv-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function DateText({ children }: { children: string }) {
  return <span className="academic-cv-date">{children}</span>;
}

function EntryHeader({
  title,
  date,
  subtitle,
  subtitleBold = false,
  titleBold = true,
}: {
  title: string;
  date?: string;
  subtitle?: string;
  subtitleBold?: boolean;
  titleBold?: boolean;
}) {
  return (
    <div className="academic-cv-entry-header">
      <div className="academic-cv-entry-title">
        {titleBold ? <strong>{title}</strong> : title}
        {subtitle && (
          <span style={subtitleBold ? { fontWeight: 700 } : undefined}>{` – ${subtitle}`}</span>
        )}
      </div>
      {date && <DateText>{date}</DateText>}
    </div>
  );
}

function AcademicRichText({ html }: { html?: string }) {
  if (!html?.trim()) return null;
  return (
    <div className="academic-cv-richtext">
      <HTMLRenderer htmlString={html} />
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function compactUrl(value?: string) {
  return (value ?? '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function skillRows(skills: Record<string, SkillItem[] | undefined>, language: ResumeLanguage) {
  const labels = ACADEMIC_LABELS[language];
  const categories: [string, keyof typeof skills][] = [
    [labels.frameworks, 'frameworks'],
    [labels.technologies, 'technologies'],
    [labels.libraries, 'libraries'],
    [labels.databases, 'databases'],
    [labels.practices, 'practices'],
    [labels.tools, 'tools'],
  ];
  const rows = categories
    .map(([label, key]) => ({ label, items: skills[key] ?? [] }))
    .filter(({ items }) => items.length > 0);
  const programming = (skills.languages ?? []).filter((item) => isProgrammingLanguage(item.name));
  if (programming.length) rows.unshift({ label: labels.programming, items: programming });
  return rows;
}

export default function AcademicCvTemplate() {
  const data = useContext(StateContext);
  const language = useResumeLanguageStore((state) => state.language);
  const overrides = useSectionTitleStore((state) => state.titles['academic-cv']);
  useEffect(() => {
    useResumeLanguageStore.getState().hydrate();
    useSectionTitleStore.getState().hydrate();
  }, []);
  const labels = ACADEMIC_LABELS[language];
  const title = (id: keyof typeof labels) => overrides?.[id] ?? labels[id];
  const { regions } = useSectionLayoutRuntime();
  const basics = data.basics;
  const education: EducationItem[] = data.education ?? [];
  const work: ExperienceItem[] = data.work ?? [];
  const awards: AwardItem[] = data.awards ?? [];
  const skills = data.skills ?? {};
  const languages: SkillItem[] = skills.languages ?? [];
  const publicationHtml = data.activities?.publications ?? '';
  const researchInterests: string[] = data.activities?.researchInterests ?? [];
  const location = basics.location?.city?.trim();
  const website = compactUrl(basics.url);
  const websiteHref = basics.url
    ? /^https?:\/\//i.test(basics.url)
      ? basics.url
      : `https://${basics.url}`
    : '';
  const contacts = [
    { id: 'location', content: location ? <span>{location}</span> : null },
    { id: 'website', content: website ? <a href={websiteHref}>{website}</a> : null },
    {
      id: 'phone',
      content: basics.phone ? <span>{`${labels.phone} ${basics.phone}`}</span> : null,
    },
    {
      id: 'email',
      content: basics.email ? <a href={`mailto:${basics.email}`}>{basics.email}</a> : null,
    },
  ].filter((contact) => contact.content !== null);

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return (
          <AcademicSection title={title('summary')}>
            <AcademicRichText html={basics.summary} />
          </AcademicSection>
        );
      case 'research_experience': {
        const researchWork = work.filter(isResearchExperience);
        return researchWork.length ? (
          <AcademicSection title={title('research_experience')}>
            {researchWork.map((item, index) => (
              <div className="academic-cv-entry" key={item.id || index}>
                <EntryHeader
                  title={item.position}
                  titleBold={false}
                  date={academicDateRange(
                    item.startDate,
                    item.endDate,
                    item.isWorkingHere,
                    language
                  )}
                />
                {item.name && <div className="academic-cv-work-org">{item.name}</div>}
                <AcademicRichText html={item.summary} />
              </div>
            ))}
          </AcademicSection>
        ) : null;
      }
      case 'education':
        return education.length ? (
          <AcademicSection title={title('education')}>
            {education.map((item, index) => {
              const thesis = getEducationThesis(item);
              const legacyThesisIndex = thesis.legacyCourseIndices[0];
              const educationBullets: ({ type: 'thesis' } | { type: 'course'; text: string })[] =
                [];
              (item.courses ?? []).forEach((course, courseIndex) => {
                if (courseIndex === legacyThesisIndex) {
                  educationBullets.push({ type: 'thesis' });
                } else if (!thesis.legacyCourseIndices.includes(courseIndex)) {
                  educationBullets.push({ type: 'course', text: course });
                }
              });
              if (thesis.legacyCourseIndices.length === 0 && (thesis.title || thesis.details)) {
                educationBullets.push({ type: 'thesis' });
              }
              return (
                <div className="academic-cv-entry" key={item.id || index}>
                  <EntryHeader
                    title={item.institution}
                    subtitle={item.isStudyingHere ? item.studyType : undefined}
                    subtitleBold={item.isStudyingHere}
                    date={academicDateRange(
                      item.startDate,
                      item.endDate,
                      item.isStudyingHere,
                      language
                    )}
                  />
                  {!item.isStudyingHere && item.studyType && (
                    <div className="academic-cv-degree">{item.studyType}</div>
                  )}
                  {item.area && (
                    <div className="academic-cv-detail academic-cv-education-area">
                      <AcademicRichText html={item.area} />
                    </div>
                  )}
                  {item.score && (
                    <div className="academic-cv-detail">
                      <AcademicRichText html={item.score} />
                    </div>
                  )}
                  {educationBullets.length > 0 && (
                    <ul className="academic-cv-bullets">
                      {educationBullets.map((bullet, courseIndex) =>
                        bullet.type === 'thesis' ? (
                          <li key={`${item.id || index}-thesis-${courseIndex}`}>
                            <strong>{labels.thesis}:</strong>{' '}
                            {thesis.title && <>“{thesis.title}”</>}
                            {thesis.details && (
                              <>
                                {thesis.title ? ' – ' : ''}
                                {thesis.details}
                              </>
                            )}
                          </li>
                        ) : (
                          <li key={`${item.id || index}-course-${courseIndex}`}>{bullet.text}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </AcademicSection>
        ) : null;
      case 'work': {
        const professionalWork = work.filter((item) => !isResearchExperience(item));
        return professionalWork.length ? (
          <AcademicSection title={title('work')}>
            {professionalWork.map((item, index) => (
              <div className="academic-cv-entry" key={item.id || index}>
                <EntryHeader
                  title={item.position}
                  date={academicDateRange(
                    item.startDate,
                    item.endDate,
                    item.isWorkingHere,
                    language
                  )}
                />
                {item.name && <div className="academic-cv-work-org">{item.name}</div>}
                <AcademicRichText html={item.summary} />
              </div>
            ))}
          </AcademicSection>
        ) : null;
      }
      case 'research_interests':
        return researchInterests.length ? (
          <AcademicSection title={title('research_interests')}>
            <ul className="academic-cv-bullets">
              {researchInterests.map((interest, index) => (
                <li key={`${interest}-${index}`}>{interest}</li>
              ))}
            </ul>
          </AcademicSection>
        ) : null;
      case 'awards':
        return awards.length ? (
          <AcademicSection title={title('awards')}>
            <ul className="academic-cv-bullets academic-cv-awards">
              {awards.map((item, index) => (
                <li key={item.id || index}>
                  <strong>{item.title}</strong>
                  {item.awarder && ` — ${item.awarder}`}
                  {item.date && ` (${academicDate(item.date, language)})`}
                  <AcademicRichText html={item.summary} />
                </li>
              ))}
            </ul>
          </AcademicSection>
        ) : null;
      case 'publications':
        return publicationHtml.trim() ? (
          <AcademicSection title={title('publications')} className="academic-cv-publications">
            <AcademicRichText html={publicationHtml} />
          </AcademicSection>
        ) : null;
      case 'skills': {
        const rows = skillRows(skills, language);
        return rows.length ? (
          <AcademicSection title={title('skills')}>
            <div className="academic-cv-skill-rows">
              {rows.map((row) => {
                const label =
                  row.label === labels.programming &&
                  row.items.every((item) => (item.level > 5 ? item.level >= 75 : item.level >= 4))
                    ? `${labels.programming} (${labels.advanced})`
                    : row.label;
                return (
                  <div key={row.label}>
                    <strong>{label}:</strong> {row.items.map((item) => item.name).join(', ')}
                  </div>
                );
              })}
            </div>
          </AcademicSection>
        ) : null;
      }
      case 'languages':
        return languages.some((language) => !isProgrammingLanguage(language.name)) ? (
          <AcademicSection title={title('languages')}>
            <div className="academic-cv-language-line">
              {languages
                .filter((language) => !isProgrammingLanguage(language.name))
                .map((language, index) => {
                  const level = language.level;
                  const descriptor =
                    level > 5
                      ? level >= 90
                        ? labels.native
                        : level >= 75
                          ? labels.fluent
                          : level >= 50
                            ? labels.intermediate
                            : labels.basic
                      : level >= 5
                        ? labels.native
                        : level >= 4
                          ? labels.fluent
                          : level >= 3
                            ? labels.intermediate
                            : labels.basic;
                  return (
                    <span key={`${language.name}-${index}`}>
                      {index > 0 && ' · '}
                      <strong>{escapeHtml(language.name)}</strong> ({descriptor})
                    </span>
                  );
                })}
            </div>
          </AcademicSection>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <ResumePresentation value="standard">
      <>
        <AcademicPage name={basics.name} pageNumber={1} language={language}>
          <header className="academic-cv-header">
            <h1>{basics.name}</h1>
            {basics.label && (
              <div className="academic-cv-tagline">{basics.label.replace(/\s*·\s*/g, ' · ')}</div>
            )}
            {contacts.length > 0 && (
              <div className="academic-cv-contact">
                {contacts.map((contact, index) => (
                  <Fragment key={contact.id}>
                    {index > 0 && <span className="academic-cv-contact-separator">|</span>}
                    {contact.content}
                  </Fragment>
                ))}
              </div>
            )}
          </header>
          <TemplateRegion
            regionId="page1"
            items={regions.page1}
            renderSection={renderSection}
            language={language === 'el' ? 'el' : 'en'}
          />
        </AcademicPage>
        <AcademicPage name={basics.name} pageNumber={2} language={language}>
          <TemplateRegion
            regionId="page2"
            items={regions.page2}
            renderSection={renderSection}
            language={language === 'el' ? 'el' : 'en'}
          />
        </AcademicPage>
      </>
    </ResumePresentation>
  );
}
