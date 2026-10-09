import { padding } from '@/helpers/resume-style/styles';
import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useSectionLayoutRuntime } from '@/helpers/section-layout';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { pageStyle } from '@/templates/components/primitives/layoutPrimitives';
import { ResumePresentation, useResumePalette } from '@/templates/components/theme';
import { AchievementsSection, AwardsSection } from '@/templates/components/awards';
import { StandardEducation } from '@/templates/components/education';
import { TimelineExperience } from '@/templates/components/experience';
import { ExperienceProfile } from '@/templates/components/profile';
import { ChipSkills } from '@/templates/components/skills';
import { ProfileSummarySection, TextSection } from '@/templates/components/text';
import type { ExperienceItem } from '@/templates/components/types';
import { ProjectsSection } from '@/templates/components/projects';
import { TemplateRegion } from '@/templates/designs/integration/TemplateRegion';
import {
  isResearchExperience,
  isTeiAthensExperience,
  normalizeInstitution,
} from '@/templates/designs/registry/predicates';

const languageDescriptors: Record<string, string> = {
  ελληνικα: 'μητρική',
  αγγλικα: 'C1',
  γαλλικα: 'B1',
  γερμανικα: 'βασικές γνώσεις',
};

function languageSummary(languages: readonly { name: string }[]) {
  const text = languages
    .map((language) => {
      const name = language.name.trim();
      const descriptor = languageDescriptors[normalizeInstitution(name)];
      const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return descriptor ? `${safeName} (${descriptor})` : safeName;
    })
    .join(' · ');
  return text ? `<p>${text}</p>` : '';
}

function ResumePage({ children, pageNumber }: { children: ReactNode; pageNumber: number }) {
  const palette = useResumePalette();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitFactor, setFitFactor] = useState(1);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    const fitPage = () => {
      const pageStyle = window.getComputedStyle(page);
      const verticalPadding =
        Number.parseFloat(pageStyle.paddingTop) + Number.parseFloat(pageStyle.paddingBottom);
      const availableHeight = page.clientHeight - verticalPadding;
      const contentHeight = content.scrollHeight;
      if (availableHeight <= 0 || contentHeight <= 0) return;
      const appliedScale =
        Number.parseFloat(window.getComputedStyle(content).getPropertyValue('--resume-fit-scale')) ||
        1;
      const nextFactor = Math.min(1, (appliedScale * availableHeight * 0.995) / contentHeight);
      if (Math.abs(nextFactor - appliedScale) > 0.001) setFitFactor(nextFactor);
    };

    fitPage();
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(fitPage);
    observer?.observe(page);
    observer?.observe(content);
    if (!observer) window.addEventListener('resize', fitPage);
    document.fonts?.ready.then(fitPage);
    return () => {
      observer?.disconnect();
      if (!observer) window.removeEventListener('resize', fitPage);
    };
  }, [children]);

  return (
    <div className="resume-a4-page" role="region" aria-label={`Resume page ${pageNumber}`}>
      <div
        ref={pageRef}
        className="resume-page-content"
        style={{
          ...pageStyle(palette),
          padding: padding('14px 18px'),
          ...(pageNumber === 1
            ? ({ '--resume-section': '6px', '--resume-entry': '4px' } as CSSProperties)
            : {}),
        }}
      >
        <div
          ref={contentRef}
          style={{
            width: '100%',
            '--resume-fit-scale': fitFactor,
          } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TwoPageTemplate() {
  const data = useContext(StateContext);
  const { regions } = useSectionLayoutRuntime();
  const palette = useResumePalette();
  const basics = data.basics;
  const profileBasics = {
    ...basics,
    url: '',
    profiles: basics.profiles ?? [],
  };
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return (
          <ProfileSummarySection
            html={basics.summary}
            title="Επαγγελματικό Προφίλ"
            density="compact"
          />
        );
      case 'objective':
        return <TextSection html={basics.objective} title="Επαγγελματικός Στόχος" density="compact" />;
      case 'work':
        return (
          <TimelineExperience
            items={data.work.filter((item: ExperienceItem) => !isResearchExperience(item))}
            title="Επαγγελματική Εμπειρία"
            dateLocale="el"
            density="compact"
          />
        );
      case 'research_experience': {
        const items = data.work.filter((item: ExperienceItem) => isResearchExperience(item));
        const teiIds = items
          .filter((item: ExperienceItem) => isTeiAthensExperience(item))
          .map((item: ExperienceItem) => item.id);
        return (
          <TimelineExperience
            items={items}
            title="Ερευνητική Εμπειρία"
            dateLocale="el"
            yearOnlyIds={teiIds}
            density="compact"
          />
        );
      }
      case 'tech_expertise':
        return (
          <>
            <TextSection
              html={languageSummary(data.skills.languages)}
              title="Γλώσσες"
              density="compact"
            />
            {data.skills.frameworks.length > 0 && (
              <ChipSkills
                items={data.skills.frameworks}
                title="Τεχνικές Γνώσεις"
                density="compact"
              />
            )}
          </>
        );
      case 'skills_exposure':
        return (
          <ChipSkills
            items={data.skills.technologies.concat(data.skills.libraries, data.skills.databases)}
            title="Δεξιότητες και Τεχνολογίες"
            density="compact"
          />
        );
      case 'methodology':
        return (
          <ChipSkills
            items={data.skills.practices}
            title="Μεθοδολογίες και Πρακτικές"
            density="compact"
          />
        );
      case 'tools':
        return <ChipSkills items={data.skills.tools} title="Εργαλεία" density="compact" />;
      case 'education':
        return (
          <StandardEducation
            items={data.education}
            title="Εκπαίδευση"
            dateLocale="el"
            density="compact"
            institutionInline
          />
        );
      case 'involvement':
        return (
          <ProjectsSection
            html={data.activities.involvements}
            title="Έργα και Δραστηριότητες"
            density="compact"
          />
        );
      case 'achievements':
        return (
          <AchievementsSection
            html={data.activities.achievements}
            title="Διακρίσεις"
            density="compact"
          />
        );
      case 'awards':
        return (
          <AwardsSection
            items={data.awards}
            title="Πιστοποιήσεις"
            dateLocale="el"
            density="compact"
          />
        );
      case 'publications':
        return (
          <TextSection
            html={data.activities.publications}
            title="Δημοσιεύσεις"
            density="compact"
          />
        );
      default:
        return null;
    }
  };

  return (
    <ResumePresentation value="boxed">
      <>
        <ResumePage pageNumber={1}>
          <ExperienceProfile
            basics={profileBasics}
            photo={basics.image}
            subtitle={basics.relExp}
            websiteUrl={basics.totalExp || basics.url}
            showExperienceMetrics={false}
            labels={{
              profile: 'Προφίλ',
              relevantExperience: 'Σχετική επαγγελματική εμπειρία',
              totalExperience: 'Συνολική επαγγελματική εμπειρία',
            }}
          />
          <TemplateRegion
            regionId="page1"
            items={regions.page1}
            renderSection={renderSection}
            language="el"
          />
        </ResumePage>
        <ResumePage pageNumber={2}>
          <div
            style={{
              margin: '0 0 10px',
              color: palette.primary,
              fontSize: 'var(--resume-heading, 11px)',
              fontWeight: 600,
            }}
          >
            {basics.name} — Συνέχεια
          </div>
          <TemplateRegion
            regionId="page2"
            items={regions.page2}
            renderSection={renderSection}
            language="el"
          />
        </ResumePage>
      </>
    </ResumePresentation>
  );
}
