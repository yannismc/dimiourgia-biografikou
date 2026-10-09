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

export function useTemplateSectionLayout(templateId: string, allowed: Set<string>) {
  const stored = useSectionLayoutStore((s) => s.layouts[templateId]);
  const setLayout = useSectionLayoutStore((s) => s.setLayout);
  const config = getTemplateSectionLayoutConfig(templateId);
  const migratedStored = useMemo(
    () => migrateNewRegions(stored, config.defaults, config.regionKeys),
    [stored, config.defaults, config.regionKeys]
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
