import { bodySize } from '@/helpers/resume-style/styles';
import { ContactList } from '../contact';
import { SocialIconsRow } from '../primitives/Contact';
import { SectionFrame } from '../primitives/SectionFrame';
import { useSurfacePalette } from '../theme';
import type { ProfileBasics } from '../types';
type Labels = {
  profile: string;
  relevantExperience: string;
  totalExperience: string;
};

export function ExperienceProfile({
  basics,
  labels,
}: {
  basics: ProfileBasics;
  labels: Labels;
}) {
  const p = useSurfacePalette();
  return (
    <SectionFrame
      title={basics.name || labels.profile}
      heading="profile"
      headerActions={
        basics.profiles?.some((profile) => profile.url) ? (
          <SocialIconsRow profiles={basics.profiles} color={p.primary} />
        ) : undefined
      }
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 14,
          flexWrap: 'wrap',
          fontSize: bodySize(12),
        }}
      >
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ color: p.primary, fontSize: bodySize(14), fontWeight: 500 }}>
            {basics.label}
          </div>
          {basics.relExp && (
            <div>
              {labels.relevantExperience}: {basics.relExp}
            </div>
          )}
          {basics.totalExp && (
            <div>
              {labels.totalExperience}: {basics.totalExp}
            </div>
          )}
        </div>
        <div style={{ marginLeft: 'auto', minWidth: 0, maxWidth: '100%' }}>
          <ContactList basics={{ ...basics, profiles: [] }} density="comfortable" align="right" />
        </div>
      </div>
    </SectionFrame>
  );
}
