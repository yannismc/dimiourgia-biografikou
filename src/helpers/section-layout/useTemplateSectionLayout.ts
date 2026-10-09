import { getTemplateSectionLayoutConfig } from '@/helpers/section-layout/template-defaults';
import { normalizeRegionLayout } from '@/helpers/section-layout/normalizeRegionLayout';
import { useSectionLayoutStore } from '@/stores/useSectionLayoutStore';
import { useCallback, useMemo } from 'react';

function migrateNewRegions(
  stored: Record<string, string[]> | undefined,
  defaults: Record<string, string[]>,
  regionKeys: string[]
) {
  if (!stored) return stored;
  const missing = regionKeys.filter((region) => !(region in stored));
  if (!missing.length) return stored;

  const migrated = { ...stored };
  for (const region of missing) {
    const incoming = new Set(defaults[region] ?? []);
    const moved = new Set<string>();
    for (const [source, items] of Object.entries(stored)) {
      if (missing.includes(source)) continue;
      const remaining = items.filter((id) => {
        if (!incoming.has(id)) return true;
        moved.add(id);
        return false;
      });
      migrated[source] = remaining;
    }
    migrated[region] = [
      ...(stored[region] ?? []),
      ...(defaults[region] ?? []).filter((id) => moved.has(id)),
    ];
  }
  return migrated;
}

function migrateProfessionalEducationSwap(
  stored: Record<string, string[]> | undefined,
  defaults: Record<string, string[]>
) {
  if (!stored) return stored;
  if (stored.footer?.includes('education') && stored.left?.includes('involvement')) {
    return {
      ...stored,
      left: stored.left.map((id) => (id === 'involvement' ? 'education' : id)),
      footer: stored.footer.map((id) => (id === 'education' ? 'involvement' : id)),
    };
  }
  if (stored.footer?.includes('involvement') && stored.right?.includes('education')) {
    const left = [...(stored.left ?? [])];
    const educationRank = defaults.left?.indexOf('education') ?? -1;
    const insertAt = left.findIndex((id) => {
      const rank = defaults.left?.indexOf(id) ?? -1;
      return rank >= 0 && educationRank >= 0 && rank > educationRank;
    });
    left.splice(insertAt < 0 ? left.length : insertAt, 0, 'education');
    return {
      ...stored,
      left,
      right: stored.right.filter((id) => id !== 'education'),
    };
  }
  return stored;
}

export function useTemplateSectionLayout(templateId: string, allowed: Set<string>) {
  const stored = useSectionLayoutStore((s) => s.layouts[templateId]);
  const setLayout = useSectionLayoutStore((s) => s.setLayout);
  const config = getTemplateSectionLayoutConfig(templateId);
  const migratedStored = useMemo(
    () => {
      const regions = migrateNewRegions(stored, config.defaults, config.regionKeys);
      return templateId === 'professional'
        ? migrateProfessionalEducationSwap(regions, config.defaults)
        : regions;
    },
    [stored, templateId, config.defaults, config.regionKeys]
  );

  const regions = useMemo(
    () => normalizeRegionLayout(migratedStored, allowed, config.defaults, config.regionKeys),
    [migratedStored, allowed, config.defaults, config.regionKeys]
  );

  const setRegions = useCallback(
    (next: Record<string, string[]>) => {
      setLayout(templateId, next);
    },
    [setLayout, templateId]
  );

  return {
    regions,
    setRegions,
    regionKeys: config.regionKeys,
    defaults: config.defaults,
  };
}
