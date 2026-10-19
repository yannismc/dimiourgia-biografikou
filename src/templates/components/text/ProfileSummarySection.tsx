import { RichText } from '../primitives/RichText';
import { SectionFrame } from '../primitives/SectionFrame';
import { hasContent } from '../primitives/content';
import { useSurfacePalette } from '../theme';
import type { TextProps } from '../types';

const SummaryContent = styled.div`
  display: flow-root;
  text-align: justify;

  &[data-indent] p {
    text-indent: 2em;
  }

  &[data-indent] li p {
    text-indent: 0;
  }
`;

export function ProfileSummarySection({
  html,
  image,
  title = 'Summary',
  imageAlt = 'Profile',
  density,
  indentParagraphs = false,
}: TextProps & { image?: string; imageAlt?: string; indentParagraphs?: boolean }) {
  const p = useSurfacePalette();
  if (!hasContent(html)) return null;
  return (
    <SectionFrame title={title} density={density}>
      <SummaryContent data-indent={indentParagraphs || undefined}>
        {image && (
          <img
            src={image}
            alt={imageAlt}
            style={{
              float: 'left',
              width: 80,
              maxWidth: '45%',
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: '50%',
              shapeOutside: 'circle(50%)',
              margin: '0 12px 4px 0',
            }}
          />
        )}
        <RichText html={html!} p={p} />
      </SummaryContent>
    </SectionFrame>
  );
}
import styled from '@emotion/styled';
