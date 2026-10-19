import {
  useDatabases,
  useFrameworks,
  useLanguages,
  useLibraries,
  usePractices,
  useTechnologies,
  useTools,
} from '@/stores/skills';

import ResumeData from '@/helpers/constants/resumes/Anonym.el.json';
import { useSectionLayoutStore } from '@/stores/useSectionLayoutStore';
import { useTemplates } from '@/stores/useTemplate';
import { isResearchExperience } from '@/templates/designs/registry/predicates';
import { useActivity } from './activity';
import { useAwards } from './awards';
import { useBasicDetails } from './basic';
import { useEducations } from './education';
import { useExperiences } from './experience';
import { useVoluteeringStore } from './volunteering';
import { useMemo } from 'react';

export const useResumeStore = () => {
  const storedBasics = useBasicDetails((state) => state.values);
  const work = useExperiences((state) => state.experiences);
  const education = useEducations((state) => state.academics);
  const awards = useAwards((state) => state.awards);
  const volunteer = useVoluteeringStore((state) => state.volunteeredExps);
  // Use each skill store's visibility-aware getter so hidden skills are
  // excluded from the resume preview as well as the editor.
  const languages = useLanguages((state) => state.get());
  const frameworks = useFrameworks((state) => state.get());
  const technologies = useTechnologies((state) => state.get());
  const libraries = useLibraries((state) => state.get());
  const databases = useDatabases((state) => state.get());
  const practices = usePractices((state) => state.get());
  const tools = useTools((state) => state.get());
  const activities = useActivity((state) => state.get());
  const sectionVisibility = useSectionLayoutStore((state) => state.sectionVisibility);
  const activeTemplateId = useTemplates((state) => state.activeTemplate.id);

  const basics = useMemo(
    () => ({
      ...storedBasics,
      summary: sectionVisibility.summary === false ? '' : storedBasics.summary,
      objective: sectionVisibility.objective === false ? '' : storedBasics.objective,
      email: sectionVisibility.contact_info === false ? '' : storedBasics.email,
      phone: sectionVisibility.contact_info === false ? '' : storedBasics.phone,
      url: sectionVisibility.contact_info === false ? '' : storedBasics.url,
      location:
        sectionVisibility.contact_info === false
          ? {
              ...storedBasics.location,
              address: '',
              postalCode: '',
              city: '',
              countryCode: '',
              region: '',
            }
          : storedBasics.location,
      relExp: sectionVisibility.contact_info === false ? '' : storedBasics.relExp,
      totalExp: sectionVisibility.contact_info === false ? '' : storedBasics.totalExp,
      profiles: sectionVisibility.links === false ? [] : storedBasics.profiles,
    }),
    [storedBasics, sectionVisibility]
  );
  const visibleWork = useMemo(() => {
    const hasSeparateResearchSection = ['academic-cv', 'two-page'].includes(activeTemplateId);
    if (!hasSeparateResearchSection) return sectionVisibility.work === false ? [] : work;

    return work.filter((item) =>
      isResearchExperience(item)
        ? sectionVisibility.research_experience !== false
        : sectionVisibility.work !== false
    );
  }, [activeTemplateId, sectionVisibility.research_experience, sectionVisibility.work, work]);
  const visibleEducation = useMemo(
    () => (sectionVisibility.education === false ? [] : education),
    [sectionVisibility.education, education]
  );
  const visibleAwards = useMemo(
    () => (sectionVisibility.awards === false ? [] : awards),
    [sectionVisibility.awards, awards]
  );
  const visibleVolunteer = useMemo(
    () => (sectionVisibility.volunteer === false ? [] : volunteer),
    [sectionVisibility.volunteer, volunteer]
  );
  const visibleActivities = useMemo(
    () => ({
      ...activities,
      involvements: sectionVisibility.involvement === false ? '' : activities.involvements,
      achievements: sectionVisibility.achievements === false ? '' : activities.achievements,
      publications: sectionVisibility.publications === false ? '' : activities.publications,
      researchInterests:
        sectionVisibility.research_interests === false ? [] : (activities.researchInterests ?? []),
    }),
    [activities, sectionVisibility]
  );

  return useMemo(
    () => ({
      ...ResumeData,
      basics,
      work: visibleWork,
      education: visibleEducation,
      awards: visibleAwards,
      volunteer: visibleVolunteer,
      skills: { languages, frameworks, technologies, libraries, databases, practices, tools },
      activities: visibleActivities,
    }),
    [
      basics,
      visibleWork,
      visibleEducation,
      visibleAwards,
      visibleVolunteer,
      languages,
      frameworks,
      technologies,
      libraries,
      databases,
      practices,
      tools,
      visibleActivities,
    ]
  );
};

/**
 * @description Reset all the stores
 */
export const resetResumeStore = () => {
  useBasicDetails.getState().reset(ResumeData.basics);
  useLanguages.getState().reset(ResumeData.skills.languages);
  useFrameworks.getState().reset(ResumeData.skills.frameworks);
  useLibraries.getState().reset(ResumeData.skills.libraries);
  useDatabases.getState().reset(ResumeData.skills.databases);
  useTechnologies.getState().reset(ResumeData.skills.technologies);
  usePractices.getState().reset(ResumeData.skills.practices);
  useTools.getState().reset(ResumeData.skills.tools);
  useExperiences.getState().reset(ResumeData.work);
  useEducations.getState().reset(ResumeData.education);
  useVoluteeringStore.getState().reset(ResumeData.volunteer);
  useAwards.getState().reset(ResumeData.awards);
  useActivity.getState().reset(ResumeData.activities);
  useSectionLayoutStore.getState().resetAll();
};
