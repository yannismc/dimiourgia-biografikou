import { font, bodySize, spacing } from '@/helpers/resume-style/styles';
import { SectionFrame } from '../primitives/SectionFrame';
import { formatDateRange, type DateLocale } from '../primitives/formatDateRange';
import { useSurfacePalette, MONO_FONT } from '../theme';
import type { EducationItem, ItemsProps } from '../types';

type Props = ItemsProps<EducationItem> & {
  dateLocale?: DateLocale;
  institutionInline?: boolean;
};
function Education({
  items,
  title = 'Education',
  density,
  dateLocale = 'en',
  design,
  institutionInline = false,
}: Props & { design: 'standard' | 'compact' | 'technical' }) {
  const p = useSurfacePalette();
  if (!items.length) return null;
  return (
    <SectionFrame title={title} density={density}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            marginBottom:
              index === items.length - 1 ? 0 : spacing('entry', design === 'compact' ? 10 : 14),
          }}
        >
          {institutionInline ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                columnGap: 12,
                rowGap: 2,
              }}
            >
              <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                <span style={{ fontWeight: design === 'standard' ? 400 : 600 }}>
                  {[item.studyType, item.area].filter(Boolean).join(' — ')}
                </span>
                {item.institution && (
                  <span style={{ color: p.muted }}> — {item.institution}</span>
                )}
              </div>
              <span
                style={{
                  color: p.muted,
                  fontSize: bodySize(10.5),
                  whiteSpace: 'nowrap',
                }}
              >
                {formatDateRange(item.startDate, item.endDate, item.isStudyingHere, dateLocale)}
              </span>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: design === 'standard' ? 400 : 600 }}>
                {[item.studyType, item.area].filter(Boolean).join(' — ')}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 6,
                  flexWrap: 'wrap',
                  color: p.muted,
                  fontSize: bodySize(10.5),
                  ...(design === 'compact' ? { flexDirection: 'column', gap: 0 } : {}),
                  ...(design === 'technical' ? { fontFamily: font(MONO_FONT) } : {}),
                }}
              >
                <span style={{ fontWeight: 400 }}>{item.institution}</span>
                <span>
                  {formatDateRange(item.startDate, item.endDate, item.isStudyingHere, dateLocale)}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </SectionFrame>
  );
}
export const StandardEducation = (props: Props) => <Education {...props} design="standard" />;
export const CompactEducation = (props: Props) => <Education {...props} design="compact" />;
export const TechnicalEducation = (props: Props) => <Education {...props} design="technical" />;
