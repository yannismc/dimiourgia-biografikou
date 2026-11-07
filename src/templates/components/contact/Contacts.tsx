import { ContactBlock, SocialIconsRow } from '@/templates/components/primitives/Contact';
import { SectionFrame } from '@/templates/components/primitives/SectionFrame';
import { ResumeSurface, useSurfacePalette } from '@/templates/components/theme';
import type { ProfileBasics, SectionProps } from '@/templates/components/types';
export type ContactProps = {
  basics: ProfileBasics;
  density?: SectionProps['density'];
  size?: number;
  underlineLinks?: boolean;
  align?: 'left' | 'center' | 'right';
};
function Contacts({
  basics,
  density,
  size,
  underlineLinks,
  align = 'left',
  inline = false,
}: ContactProps & { inline?: boolean }) {
  const p = useSurfacePalette();
  if (
    ![basics.email, basics.phone, basics.url, basics.location?.city].some(Boolean) &&
    !basics.profiles?.some((item) => item.url)
  )
    return null;
  return (
    <div style={{ color: p.text, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ContactBlock
        email={basics.email}
        phone={basics.phone}
        city={basics.location?.city}
        url={basics.url}
        inline={inline}
        density={density}
        size={size}
        underlineLinks={underlineLinks}
        align={align}
      />
      <SocialIconsRow
        profiles={basics.profiles}
        color={p.primary}
        align={align}
        underlineLinks={underlineLinks}
      />
    </div>
  );
}
export const InlineContacts = (props: ContactProps) => <Contacts {...props} inline />;
export const ContactList = (props: ContactProps) => <Contacts {...props} />;
function CardContents(props: ContactProps) {
  const p = useSurfacePalette();
  return (
    <div style={{ background: p.bg, padding: 14, borderRadius: 10 }}>
      <SectionFrame title="Contact" density="compact">
        <ContactList {...props} />
      </SectionFrame>
    </div>
  );
}
export function ContactCard(props: ContactProps) {
  const b = props.basics;
  if (
    ![b.email, b.phone, b.url, b.location?.city].some(Boolean) &&
    !b.profiles?.some((item) => item.url)
  )
    return null;
  return (
    <ResumeSurface surface="tinted">
      <CardContents {...props} />
    </ResumeSurface>
  );
}
