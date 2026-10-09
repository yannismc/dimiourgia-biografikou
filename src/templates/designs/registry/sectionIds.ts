/**
 * Canonical section and region string ids. Use these in the template registry and in
 * template `switch (sectionId)` branches so typos are caught by TypeScript.
 *
 * Add a new entry here when introducing a section id that did not exist before.
 */
export const REGION_IDS = {
  left: 'left',
  right: 'right',
  footer: 'footer',
  page1: 'page1',
  page2: 'page2',
  main: 'main',
  sidebar: 'sidebar',
} as const;

export const SECTION_IDS = {
  summary: 'summary',
  work: 'work',
  researchExperience: 'research_experience',
  awards: 'awards',
  objective: 'objective',
  languages: 'languages',
  technologies: 'technologies',
  frameworksLibs: 'frameworks_libs',
  tools: 'tools',
  education: 'education',
  volunteer: 'volunteer',
  involvement: 'involvement',
  achievements: 'achievements',
  techExpertise: 'tech_expertise',
  skillsExposure: 'skills_exposure',
  methodology: 'methodology',
  skills: 'skills',
  projects: 'projects',
  stack: 'stack',
  skillsMerged: 'skills_merged',
  involvements: 'involvements',
  publications: 'publications',
} as const;
