import { padding, bodySize } from '@/helpers/resume-style/styles';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { formatDate, formatDateRange } from '@/templates/components/primitives/formatDateRange';
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
  useContext,
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
}: {
  children: ReactNode;
  name: string;
  pageNumber: number;
}) {
  const palette = useResumePalette();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    const fitToPage = () => {
      const computed = window.getComputedStyle(page);
      const verticalPadding =
        Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom);
      const footer = page.querySelector<HTMLElement>('.academic-cv-footer');
      const footerHeight = footer?.getBoundingClientRect().height ?? 0;
      const availableHeight = page.clientHeight - verticalPadding - footerHeight - 8;
      const contentHeight = content.scrollHeight;
      if (availableHeight <= 0 || contentHeight <= 0) return;
      const appliedScale =
        Number.parseFloat(
          window.getComputedStyle(content).getPropertyValue('--resume-fit-scale')
        ) || 1;
      const nextScale = Math.min(1, ((appliedScale * availableHeight) / contentHeight) * 0.995);
      setFitScale((current) => (Math.abs(current - nextScale) > 0.001 ? nextScale : current));
    };

    fitToPage();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(fitToPage);
    observer?.observe(page);
    observer?.observe(content);
    if (!observer) window.addEventListener('resize', fitToPage);
    document.fonts?.ready.then(fitToPage);
    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener('resize', fitToPage);
    };
  }, [children]);

  return (
    <div className="resume-a4-page" role="region" aria-label={`Resume page ${pageNumber}`}>
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
          style={{ '--resume-fit-scale': fitScale } as CSSProperties}
        >
          {children}
        </div>
        <div className="academic-cv-footer">
          {`${name} — Curriculum Vitae | Page ${pageNumber} of 2`}
        </div>
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

function skillRows(skills: Record<string, SkillItem[] | undefined>) {
  const categories: [string, keyof typeof skills][] = [
    ['Frameworks', 'frameworks'],
    ['Technologies', 'technologies'],
    ['Libraries', 'libraries'],
    ['Databases', 'databases'],
    ['Methods', 'practices'],
    ['Tools', 'tools'],
  ];
  const rows = categories
    .map(([label, key]) => ({ label, items: skills[key] ?? [] }))
    .filter(({ items }) => items.length > 0);
  const programming = (skills.languages ?? []).filter((item) => isProgrammingLanguage(item.name));
  if (programming.length) rows.unshift({ label: 'Programming', items: programming });
  return rows;
}

export default function AcademicCvTemplate() {
  const data = useContext(StateContext);
  const { regions } = useSectionLayoutRuntime();
  const basics = data.basics;
  const education: EducationItem[] = data.education ?? [];
  const work: ExperienceItem[] = data.work ?? [];
  const awards: AwardItem[] = data.awards ?? [];
  const skills = data.skills ?? {};
  const languages: SkillItem[] = skills.languages ?? [];
  const publicationHtml = data.activities?.publications ?? '';
  const researchInterests: string[] = data.activities?.researchInterests ?? [];
  const firstAffiliation =
    education[0]?.institution.replace(/\s*\([^)]*\)\s*$/, '') || work[0]?.name || '';
  const website = compactUrl(basics.url);
  const websiteHref = basics.url
    ? /^https?:\/\//i.test(basics.url)
      ? basics.url
      : `https://${basics.url}`
    : '';

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return (
          <AcademicSection title="Research Interests">
            <AcademicRichText html={basics.summary} />
          </AcademicSection>
        );
      case 'research_experience': {
        const researchWork = work.filter(isResearchExperience);
        return researchWork.length ? (
          <AcademicSection title="Research Experience">
            {researchWork.map((item, index) => (
              <div className="academic-cv-entry" key={item.id || index}>
                <EntryHeader
                  title={item.position}
                  titleBold={false}
                  date={formatDateRange(
                    item.startDate,
                    item.endDate,
                    item.isWorkingHere,
                    'en',
                    true
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
          <AcademicSection title="Education">
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
                    date={formatDateRange(
                      item.startDate,
                      item.endDate,
                      item.isStudyingHere,
                      'en',
                      true
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
                            <strong>Thesis:</strong> {thesis.title && <>“{thesis.title}”</>}
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
          <AcademicSection title="Professional Experience">
            {professionalWork.map((item, index) => (
              <div className="academic-cv-entry" key={item.id || index}>
                <EntryHeader
                  title={item.position}
                  date={formatDateRange(
                    item.startDate,
                    item.endDate,
                    item.isWorkingHere,
                    'en',
                    true
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
          <AcademicSection title="Research Interests">
            <ul className="academic-cv-bullets">
              {researchInterests.map((interest, index) => (
                <li key={`${interest}-${index}`}>{interest}</li>
              ))}
            </ul>
          </AcademicSection>
        ) : null;
      case 'awards':
        return awards.length ? (
          <AcademicSection title="Awards, Grants & Funding">
            <ul className="academic-cv-bullets academic-cv-awards">
              {awards.map((item, index) => (
                <li key={item.id || index}>
                  <strong>{item.title}</strong>
                  {item.awarder && ` — ${item.awarder}`}
                  {item.date && ` (${formatDate(item.date, 'en', true)})`}
                  <AcademicRichText html={item.summary} />
                </li>
              ))}
            </ul>
          </AcademicSection>
        ) : null;
      case 'publications':
        return publicationHtml.trim() ? (
          <AcademicSection title="Publications" className="academic-cv-publications">
            <AcademicRichText html={publicationHtml} />
          </AcademicSection>
        ) : null;
      case 'skills': {
        const rows = skillRows(skills);
        return rows.length ? (
          <AcademicSection title="Technical Skills">
            <div className="academic-cv-skill-rows">
              {rows.map((row) => {
                const label =
                  row.label === 'Programming' &&
                  row.items.every((item) => (item.level > 5 ? item.level >= 75 : item.level >= 4))
                    ? 'Programming (advanced)'
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
          <AcademicSection title="Languages">
            <div className="academic-cv-language-line">
              {languages
                .filter((language) => !isProgrammingLanguage(language.name))
                .map((language, index) => {
                  const level = language.level;
                  const descriptor =
                    level > 5
                      ? level >= 90
                        ? 'native'
                        : level >= 75
                          ? 'fluent, professional'
                          : level >= 50
                            ? 'intermediate'
                            : 'basic'
                      : level >= 5
                        ? 'native'
                        : level >= 4
                          ? 'fluent, professional'
                          : level >= 3
                            ? 'intermediate'
                            : 'basic';
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
        <AcademicPage name={basics.name} pageNumber={1}>
          <header className="academic-cv-header">
            <h1>{basics.name}</h1>
            {basics.label && (
              <div className="academic-cv-tagline">{basics.label.replace(/\s*·\s*/g, ' · ')}</div>
            )}
            {(firstAffiliation || website || basics.phone || basics.email) && (
              <div className="academic-cv-contact">
                {firstAffiliation && <span>{firstAffiliation}</span>}
                {website && (
                  <>
                    <span className="academic-cv-contact-separator">|</span>
                    <a href={websiteHref}>{website}</a>
                  </>
                )}
                {basics.phone && (
                  <>
                    <span className="academic-cv-contact-separator">|</span>
                    <span>{`tel: ${basics.phone}`}</span>
                  </>
                )}
                {basics.email && (
                  <>
                    <span className="academic-cv-contact-separator">|</span>
                    <a href={`mailto:${basics.email}`}>{basics.email}</a>
                  </>
                )}
              </div>
            )}
          </header>
          <TemplateRegion
            regionId="page1"
            items={regions.page1}
            renderSection={renderSection}
            language="en"
          />
        </AcademicPage>
        <AcademicPage name={basics.name} pageNumber={2}>
          <TemplateRegion
            regionId="page2"
            items={regions.page2}
            renderSection={renderSection}
            language="en"
          />
        </AcademicPage>
      </>
    </ResumePresentation>
  );
}
