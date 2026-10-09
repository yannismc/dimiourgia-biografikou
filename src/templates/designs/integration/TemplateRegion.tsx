import type { ComponentProps } from 'react';
import { SortableRegion, SortableTemplateSection } from '@/helpers/section-layout';
import { ResumeSurface, useSurfacePalette, type Surface } from '../../components/theme';

/** Keep layout/editor dependencies outside the visual collection. */
export function TemplateRegion({
  surface = 'page',
  renderSection,
  language = 'en',
  ...props
}: Omit<ComponentProps<typeof SortableRegion>, 'children'> & {
  surface?: Surface;
  language?: 'en' | 'el';
  renderSection: (id: string) => React.ReactNode;
}) {
  return (
    <ResumeSurface surface={surface}>
      <RegionContents {...props} language={language} renderSection={renderSection} />
    </ResumeSurface>
  );
}

function RegionContents({
  renderSection,
  language = 'en',
  ...props
}: Omit<ComponentProps<typeof SortableRegion>, 'children'> & {
  language?: 'en' | 'el';
  renderSection: (id: string) => React.ReactNode;
}) {
  const palette = useSurfacePalette();
  return (
    <SortableRegion
      {...props}
      language={language}
      style={{ minWidth: 0, color: palette.text, background: palette.bg, ...props.style }}
    >
      {(id) => (
        <SortableTemplateSection key={id} id={id} language={language}>
          {renderSection(id)}
        </SortableTemplateSection>
      )}
    </SortableRegion>
  );
}
