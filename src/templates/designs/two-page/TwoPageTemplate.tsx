import { padding } from '@/helpers/resume-style/styles';
import { useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useSectionLayoutRuntime } from '@/helpers/section-layout';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { pageStyle } from '@/templates/components/primitives/layoutPrimitives';
import { ResumePresentation, useResumePalette } from '@/templates/components/theme';
import { AchievementsSection, AwardsSection } from '@/templates/components/awards';
import { StandardEducation } from '@/templates/components/education';
import { TimelineExperience } from '@/templates/components/experience';
import { ExperienceProfile } from '@/templates/components/profile';
import { BarSkills, ChipSkills } from '@/templates/components/skills';
import { ProfileSummarySection, TextSection } from '@/templates/components/text';
import { ProjectsSection } from '@/templates/components/projects';
import { TemplateRegion } from '@/templates/designs/integration/TemplateRegion';

function ResumePage({ children, pageNumber }: { children: ReactNode; pageNumber: number }) {
  const palette = useResumePalette();
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const content = contentRef.current;
    if (!page || !content) return;

    const fitPage = () => {
      const availableHeight = page.clientHeight;
      const contentHeight = content.scrollHeight;
      if (availableHeight > 0 && contentHeight > 0) {
        setScale(Math.min(1, availableHeight / contentHeight));
      }
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
        style={{ ...pageStyle(palette), padding: padding('14px 18px') }}
      >
        <div
          ref={contentRef}
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
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
    profiles: [
      ...(basics.url ? [{ network: 'website', username: 'website', url: basics.url }] : []),
      ...(basics.profiles ?? []),
    ],
  };
  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        return (
          <ProfileSummarySection
            html={basics.summary}
            image={basics.image}
            imageAlt="Φωτογραφία προφίλ"
            title="Επαγγελματικό Προφίλ"
            density="compact"
          />
        );
      case 'objective':
        return <TextSection html={basics.objective} title="Επαγγελματικός Στόχος" density="compact" />;
      case 'work':
        return (
          <TimelineExperience
            items={data.work}
            title="Επαγγελματική Εμπειρία"
            dateLocale="el"
            density="compact"
          />
        );
      case 'tech_expertise':
        return (
          <BarSkills
            items={data.skills.languages.concat(data.skills.frameworks)}
            title={data.skills.frameworks.length ? 'Γλώσσες και Τεχνικές Γνώσεις' : 'Γλώσσες'}
            density="compact"
          />
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
        return <AwardsSection items={data.awards} title="Πιστοποιήσεις" density="compact" />;
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
