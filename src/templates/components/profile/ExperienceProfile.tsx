import { bodySize } from '@/helpers/resume-style/styles';
import { ContactList } from '../contact';
import { ContactLine, SocialIconsRow } from '../primitives/Contact';
import { SectionFrame } from '../primitives/SectionFrame';
import { useSurfacePalette } from '../theme';
import type { ProfileBasics } from '../types';
import { BsGlobe } from 'react-icons/bs';
type Labels = {
  profile: string;
  relevantExperience: string;
  totalExperience: string;
};

const DEFAULT_LABELS: Labels = {
  profile: 'Profile',
  relevantExperience: 'Relevant experience',
  totalExperience: 'Total experience',
};

export function ExperienceProfile({
  basics,
  labels = DEFAULT_LABELS,
  photo,
  subtitle,
  websiteUrl,
  showExperienceMetrics = true,
}: {
  basics: ProfileBasics;
  labels?: Labels;
  photo?: string;
  subtitle?: string;
  websiteUrl?: string;
  showExperienceMetrics?: boolean;
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
        <div style={{ minWidth: 0, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {photo && (
            <img
              src={photo}
              alt=""
              style={{
                width: 54,
                height: 54,
                flex: '0 0 54px',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          )}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ color: p.primary, fontSize: bodySize(14), fontWeight: 500 }}>
              {basics.label}
            </div>
            {subtitle && (
              <div style={{ color: p.muted, fontSize: bodySize(11), overflowWrap: 'anywhere' }}>
                {subtitle}
              </div>
            )}
            {websiteUrl && (
              <ContactLine
                icon={<BsGlobe />}
                text={websiteUrl}
                href={websiteUrl}
                density="comfortable"
              />
            )}
            {showExperienceMetrics && basics.relExp && (
              <div>
                {labels.relevantExperience}: {basics.relExp}
              </div>
            )}
            {showExperienceMetrics && basics.totalExp && (
              <div>
                {labels.totalExperience}: {basics.totalExp}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', minWidth: 0, maxWidth: '100%' }}>
          <ContactList
            basics={{ ...basics, url: websiteUrl ? '' : basics.url, profiles: [] }}
            density="comfortable"
            align="right"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
