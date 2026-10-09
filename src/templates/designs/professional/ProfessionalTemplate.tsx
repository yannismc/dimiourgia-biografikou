import { EditableResumeSection } from '@/helpers/common/components/EditableResumeSection';
import { columns, padding, spacing } from '@/helpers/resume-style/styles';
import { useResumeStyleStore } from '@/stores/useResumeStyleStore';
import { useContext } from 'react';
import { useSectionLayoutRuntime } from '@/helpers/section-layout';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { pageStyle } from '@/templates/components/primitives/layoutPrimitives';
import { ResumePresentation, useResumePalette } from '@/templates/components/theme';
import { TemplateRegion } from '@/templates/designs/integration/TemplateRegion';
import { AchievementsSection } from '@/templates/components/awards';
import { StandardEducation } from '@/templates/components/education';
import { TimelineExperience } from '@/templates/components/experience';
import { ExperienceProfile } from '@/templates/components/profile';
import { ProjectsSection } from '@/templates/components/projects';
import { BarSkills, ChipSkills } from '@/templates/components/skills';
import { ProfileSummarySection, TextSection } from '@/templates/components/text';

export default function ProfessionalTemplate() {
  const secondaryPercent = useResumeStyleStore((state) => state.settings.secondaryColumnPercent);
  const data = useContext(StateContext);
  const { regions } = useSectionLayoutRuntime();
  const resumePalette = useResumePalette();
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
      case 'work':
        return (
          <TimelineExperience
            items={data.work}
            title="Επαγγελματική Εμπειρία"
            dateLocale="el"
          />
        );
      case 'involvement':
        return (
          <ProjectsSection
            html={data.activities.involvements}
            title="Έργα και Δραστηριότητες"
          />
        );
      case 'achievements':
        return (
          <AchievementsSection
            html={data.activities.achievements}
            title="Πιστοποιήσεις και Διακρίσεις"
          />
        );
      case 'summary':
        return (
          <ProfileSummarySection
            html={basics.summary}
            image={basics.image}
            imageAlt="Φωτογραφία προφίλ"
            title="Επαγγελματικό Προφίλ"
          />
        );
      case 'objective':
        return <TextSection html={basics.objective} title="Επαγγελματικός Στόχος" />;
      case 'tech_expertise':
        return (
          <BarSkills
            items={data.skills.languages.concat(data.skills.frameworks)}
            title={
              data.skills.frameworks.length
                ? data.skills.languages.length
                  ? 'Γλώσσες και Τεχνικές Γνώσεις'
                  : 'Τεχνικές Γνώσεις'
                : 'Γλώσσες'
            }
          />
        );
      case 'skills_exposure':
        return (
          <ChipSkills
            items={data.skills.technologies.concat(data.skills.libraries, data.skills.databases)}
            title="Δεξιότητες και Τεχνολογίες"
          />
        );
      case 'methodology':
        return <ChipSkills items={data.skills.practices} title="Μεθοδολογίες και Πρακτικές" />;
      case 'tools':
        return <ChipSkills items={data.skills.tools} title="Εργαλεία" />;
      case 'education':
        return (
          <StandardEducation
            items={data.education}
            title="Εκπαίδευση"
            dateLocale="el"
            institutionInline
          />
        );
      default:
        return null;
    }
  };
  return (
    <ResumePresentation value="boxed">
      <div
        style={{
          ...pageStyle(resumePalette),
          padding: padding('20px 25px'),
          display: 'grid',
          gridTemplateColumns: columns('minmax(0, 2fr) minmax(0, 1fr)', false, secondaryPercent),
          gridTemplateRows: 'auto auto',
          alignContent: 'start',
          gap: spacing('column', 14),
        }}
      >
        <div style={{ minWidth: 0, gridColumn: 1, gridRow: 1 }}>
          <EditableResumeSection id="basics">
            <ExperienceProfile
              basics={profileBasics}
              labels={{
                profile: 'Προφίλ',
                relevantExperience: 'Σχετική επαγγελματική εμπειρία',
                totalExperience: 'Συνολική επαγγελματική εμπειρία',
              }}
            />
          </EditableResumeSection>
          <TemplateRegion
            regionId="left"
            items={regions.left}
            renderSection={renderSection}
            language="el"
          />
        </div>
        <TemplateRegion
          regionId="right"
          items={regions.right}
          renderSection={renderSection}
          language="el"
          style={{ gridColumn: 2, gridRow: 1 }}
        />
        <TemplateRegion
          regionId="footer"
          items={regions.footer}
          renderSection={renderSection}
          language="el"
          style={{ gridColumn: '1 / -1', gridRow: 2, minWidth: 0 }}
        />
      </div>
    </ResumePresentation>
  );
}
