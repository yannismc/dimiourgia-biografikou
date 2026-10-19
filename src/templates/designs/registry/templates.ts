/**
 * -----------------------------------------------------------------------------
 * CONTRIBUTING: add a new resume template
 * -----------------------------------------------------------------------------
 * 1. Create `src/templates/designs/<your-slug>/<Slug>Template.tsx` (default export).
 *    Select typed designs from `@/templates/components/<family>` through named imports.
 *    Keep data selection and page layout in the template; shared designs own section styling.
 *    Use `ResumePresentation` once and `TemplateRegion` for destination surface propagation.
 *    Add reusable designs to the shared collection, never template-local components/ or atoms/.
 * 2. If you introduce a new section id, add it to `sectionIds.ts` (`SECTION_IDS`).
 * 3. Append one entry to `TEMPLATE_REGISTRY` below (copy an existing block).
 *    — Use `REGION_IDS` + `SECTION_IDS` for every id string (avoids typos).
 *    — `sectionLayout` must match `<SortableRegion regionId={…}>` usage.
 *    — `sectionRules` must mirror the data passed to shared designs.
 * 4. Optional: add `public/templates/<slug>.webp` and set `thumbnail`.
 *
 * -----------------------------------------------------------------------------
 */
import type { TemplateRegistryEntry } from './types';
import * as has from './predicates';
import { REGION_IDS, SECTION_IDS } from './sectionIds';

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  modern: {
    id: 'modern',
    style: {
      padding: [40, 25, 40, 25],
      section: 12.8,
      entry: 16,
      column: 17.6,
      body: 11,
      heading: 12,
      name: 24,
      lineHeight: 1.425,
      secondaryColumnPercent: 33.333333333333336,
    },
    name: 'Modern',
    thumbnail: '/templates/modern.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.left, REGION_IDS.right],
      defaults: {
        [REGION_IDS.left]: [SECTION_IDS.work, SECTION_IDS.involvement, SECTION_IDS.achievements],
        [REGION_IDS.right]: [
          SECTION_IDS.summary,
          SECTION_IDS.objective,
          SECTION_IDS.techExpertise,
          SECTION_IDS.frameworks,
          SECTION_IDS.skillsExposure,
          SECTION_IDS.tools,
          SECTION_IDS.methodology,
          SECTION_IDS.education,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.involvement, when: has.involvement },
      { sectionId: SECTION_IDS.achievements, when: has.achievements },
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.objective, when: has.basicsObjective },
      { sectionId: SECTION_IDS.techExpertise, when: has.languages },
      { sectionId: SECTION_IDS.frameworks, when: has.frameworks },
      { sectionId: SECTION_IDS.skillsExposure, when: has.skillsExposure },
      { sectionId: SECTION_IDS.methodology, when: has.practices },
      { sectionId: SECTION_IDS.tools, when: has.tools },
      { sectionId: SECTION_IDS.education, when: has.education },
    ],
    loadComponent: () => import('@/templates/designs/modern/ModernTemplate'),
  },

  classic: {
    id: 'classic',
    style: {
      padding: [28, 28, 28, 28],
      section: 14,
      entry: 7,
      column: 0,
      body: 11,
      heading: 11,
      name: 26,
      lineHeight: 1.3,
    },
    name: 'Classic',
    thumbnail: '/templates/classic.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.main],
      defaults: {
        [REGION_IDS.main]: [
          SECTION_IDS.summary,
          SECTION_IDS.objective,
          SECTION_IDS.work,
          SECTION_IDS.involvement,
          SECTION_IDS.skills,
          SECTION_IDS.achievements,
          SECTION_IDS.awards,
          SECTION_IDS.education,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.objective, when: has.basicsObjective },
      { sectionId: SECTION_IDS.involvement, when: has.involvement },
      { sectionId: SECTION_IDS.achievements, when: has.achievements },
      { sectionId: SECTION_IDS.awards, when: has.awards },
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.education, when: has.education },
      { sectionId: SECTION_IDS.skills, when: has.skillsMerged },
    ],
    loadComponent: () => import('@/templates/designs/classic/ClassicTemplate'),
  },

  spotlight: {
    id: 'spotlight',
    style: {
      padding: [22, 25, 32, 25],
      section: 32,
      entry: 22,
      column: 36,
      body: 11,
      heading: 16,
      name: 28,
      lineHeight: 1.5,
      secondaryColumnPercent: 38,
    },
    name: 'Spotlight',
    thumbnail: '/templates/spotlight.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.main, REGION_IDS.sidebar],
      defaults: {
        [REGION_IDS.main]: [SECTION_IDS.work],
        [REGION_IDS.sidebar]: [
          SECTION_IDS.skills,
          SECTION_IDS.methodology,
          SECTION_IDS.tools,
          SECTION_IDS.education,
          SECTION_IDS.awards,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.education, when: has.education },
      { sectionId: SECTION_IDS.skills, when: has.skillsLangFrameworks },
      { sectionId: SECTION_IDS.awards, when: has.awards },
      { sectionId: SECTION_IDS.methodology, when: has.practices },
      { sectionId: SECTION_IDS.tools, when: has.tools },
    ],
    loadComponent: () => import('@/templates/designs/spotlight/SpotlightTemplate'),
  },

  professional: {
    id: 'professional',
    style: {
      padding: [20, 25, 20, 25],
      section: 16,
      entry: 12,
      column: 14,
      body: 11,
      heading: 12,
      name: 20,
      lineHeight: 1.5,
      secondaryColumnPercent: 33.333333333333336,
    },
    name: 'Επαγγελματικό Βιογραφικό',
    thumbnail: '/templates/professional.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.left, REGION_IDS.right, REGION_IDS.footer],
      defaults: {
        [REGION_IDS.left]: [SECTION_IDS.work, SECTION_IDS.education, SECTION_IDS.achievements],
        [REGION_IDS.right]: [
          SECTION_IDS.summary,
          SECTION_IDS.objective,
          SECTION_IDS.techExpertise,
          SECTION_IDS.skillsExposure,
          SECTION_IDS.methodology,
          SECTION_IDS.tools,
        ],
        [REGION_IDS.footer]: [SECTION_IDS.involvement],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.involvement, when: has.involvement },
      { sectionId: SECTION_IDS.achievements, when: has.achievements },
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.objective, when: has.basicsObjective },
      { sectionId: SECTION_IDS.techExpertise, when: has.techExpertise },
      { sectionId: SECTION_IDS.skillsExposure, when: has.skillsExposure },
      { sectionId: SECTION_IDS.methodology, when: has.practices },
      { sectionId: SECTION_IDS.tools, when: has.tools },
      { sectionId: SECTION_IDS.education, when: has.education },
    ],
    loadComponent: () => import('@/templates/designs/professional/ProfessionalTemplate'),
  },

  'professional-en': {
    id: 'professional-en',
    style: {
      padding: [40, 25, 40, 25],
      section: 16,
      entry: 12,
      column: 14,
      body: 11,
      heading: 12,
      name: 20,
      lineHeight: 1.5,
      secondaryColumnPercent: 33.333333333333336,
    },
    name: 'Professional Resume',
    thumbnail: '/templates/professional.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.left, REGION_IDS.right],
      defaults: {
        [REGION_IDS.left]: [SECTION_IDS.work, SECTION_IDS.involvement, SECTION_IDS.achievements],
        [REGION_IDS.right]: [
          SECTION_IDS.summary,
          SECTION_IDS.objective,
          SECTION_IDS.techExpertise,
          SECTION_IDS.skillsExposure,
          SECTION_IDS.methodology,
          SECTION_IDS.tools,
          SECTION_IDS.education,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.involvement, when: has.involvement },
      { sectionId: SECTION_IDS.achievements, when: has.achievements },
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.objective, when: has.basicsObjective },
      { sectionId: SECTION_IDS.techExpertise, when: has.techExpertise },
      { sectionId: SECTION_IDS.skillsExposure, when: has.skillsExposure },
      { sectionId: SECTION_IDS.methodology, when: has.practices },
      { sectionId: SECTION_IDS.tools, when: has.tools },
      { sectionId: SECTION_IDS.education, when: has.education },
    ],
    loadComponent: () => import('@/templates/designs/professional/ProfessionalEnglishTemplate'),
  },

  'two-page': {
    id: 'two-page',
    style: {
      pages: 2,
      padding: [14, 18, 14, 18],
      section: 9,
      entry: 7,
      column: 10,
      body: 10,
      heading: 11,
      name: 23,
      lineHeight: 1.3,
    },
    name: 'Αναλυτικό Βιογραφικό (2 σελίδες)',
    thumbnail: '/templates/professional.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.page1, REGION_IDS.page2],
      defaults: {
        [REGION_IDS.page1]: [SECTION_IDS.summary, SECTION_IDS.objective, SECTION_IDS.work],
        [REGION_IDS.page2]: [
          SECTION_IDS.researchExperience,
          SECTION_IDS.techExpertise,
          SECTION_IDS.skillsExposure,
          SECTION_IDS.methodology,
          SECTION_IDS.tools,
          SECTION_IDS.education,
          SECTION_IDS.involvement,
          SECTION_IDS.achievements,
          SECTION_IDS.awards,
          SECTION_IDS.publications,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.objective, when: has.basicsObjective },
      { sectionId: SECTION_IDS.work, when: has.employmentExperience },
      { sectionId: SECTION_IDS.techExpertise, when: has.techExpertise },
      { sectionId: SECTION_IDS.researchExperience, when: has.researchExperience },
      { sectionId: SECTION_IDS.skillsExposure, when: has.skillsExposure },
      { sectionId: SECTION_IDS.methodology, when: has.practices },
      { sectionId: SECTION_IDS.tools, when: has.tools },
      { sectionId: SECTION_IDS.education, when: has.education },
      { sectionId: SECTION_IDS.involvement, when: has.involvement },
      { sectionId: SECTION_IDS.achievements, when: has.achievements },
      { sectionId: SECTION_IDS.awards, when: has.awards },
      { sectionId: SECTION_IDS.publications, when: has.publications },
    ],
    loadComponent: () => import('@/templates/designs/two-page/TwoPageTemplate'),
  },

  'academic-cv': {
    id: 'academic-cv',
    style: {
      pages: 2,
      padding: [15, 16, 14, 16],
      section: 10,
      entry: 7,
      column: 0,
      body: 14.55,
      heading: 16,
      name: 33,
      lineHeight: 1.2,
    },
    name: 'Academic CV',
    thumbnail: '/templates/classic.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.page1, REGION_IDS.page2],
      defaults: {
        [REGION_IDS.page1]: [
          SECTION_IDS.summary,
          SECTION_IDS.education,
          SECTION_IDS.researchExperience,
        ],
        [REGION_IDS.page2]: [
          SECTION_IDS.researchInterests,
          SECTION_IDS.awards,
          SECTION_IDS.publications,
          SECTION_IDS.skills,
          SECTION_IDS.languages,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.education, when: has.education },
      { sectionId: SECTION_IDS.work, when: has.employmentExperience },
      { sectionId: SECTION_IDS.researchExperience, when: has.researchExperience },
      { sectionId: SECTION_IDS.researchInterests, when: has.researchInterests },
      { sectionId: SECTION_IDS.awards, when: has.awards },
      { sectionId: SECTION_IDS.publications, when: has.publications },
      { sectionId: SECTION_IDS.skills, when: has.technicalSkills },
      { sectionId: SECTION_IDS.languages, when: has.academicSpokenLanguages },
    ],
    loadComponent: () => import('@/templates/designs/academic-cv/AcademicCvTemplate'),
  },

  inspired: {
    id: 'inspired',
    style: {
      padding: [8, 32, 28, 32],
      section: 16,
      entry: 12,
      column: 20,
      body: 11,
      heading: 11,
      name: 26,
      lineHeight: 1.5,
      secondaryColumnPercent: 36,
    },
    name: 'Inspired',
    thumbnail: '/templates/inspired.webp',
    sectionLayout: {
      regionKeys: [REGION_IDS.main, REGION_IDS.sidebar],
      defaults: {
        [REGION_IDS.main]: [SECTION_IDS.work, SECTION_IDS.education],
        [REGION_IDS.sidebar]: [
          SECTION_IDS.summary,
          SECTION_IDS.skills,
          SECTION_IDS.technologies,
          SECTION_IDS.tools,
        ],
      },
    },
    sectionRules: [
      { sectionId: SECTION_IDS.work, when: has.work },
      { sectionId: SECTION_IDS.education, when: has.education },
      { sectionId: SECTION_IDS.summary, when: has.basicsSummary },
      { sectionId: SECTION_IDS.skills, when: has.skillsLangFrameworks },
      { sectionId: SECTION_IDS.technologies, when: has.technologies },
      { sectionId: SECTION_IDS.tools, when: has.tools },
    ],
    loadComponent: () => import('@/templates/designs/inspired/InspiredTemplate'),
  },
};
