import Image from '@/helpers/common/components/Image';
import { useSectionLayoutStore } from '@/stores/useSectionLayoutStore';

export function SectionVisibilityControl({
  sectionId,
  label,
}: {
  sectionId: string;
  label: string;
}) {
  const isVisible = useSectionLayoutStore((state) => state.isSectionVisible(sectionId));
  const setVisibility = useSectionLayoutStore((state) => state.setSectionVisibility);

  return (
    <div className="flex items-center justify-between rounded-lg bg-resume-100 px-4 py-3 text-resume-800">
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        className="rounded p-1 hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-resume-500"
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${label} in resume`}
        aria-pressed={isVisible}
        onClick={() => setVisibility(sectionId, !isVisible)}
      >
        <Image
          src={isVisible ? '/icons/eye.svg' : '/icons/eye-slash.svg'}
          alt=""
          aria-hidden="true"
          height="16"
          width="21"
        />
      </button>
    </div>
  );
}
