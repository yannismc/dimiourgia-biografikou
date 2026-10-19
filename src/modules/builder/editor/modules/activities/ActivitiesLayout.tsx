import { useEditorStore } from '@/stores/useEditorStore';
import { Fragment, SyntheticEvent, useState } from 'react';

import Achievements from './components/Achievements';
import BasicHeader from './components/BasicHeader';
import BasicPanel from './components/BasicPanel';
import Involvements from './components/Involvements';
import { ReactNode } from 'react';
import Publications from './components/Publications';
import ResearchInterests from './components/ResearchInterests';
import { SectionVisibilityControl } from '@/modules/builder/editor/components/SectionVisibilityControl';
import { SECTION_IDS } from '@/templates/designs/registry/sectionIds';

export interface IActivityTab {
  key: string;
  label: string;
  sectionId: string;
  component: () => ReactNode;
}

export interface IAllActivityTabs {
  [key: string]: IActivityTab;
}

const allActivityTabs: IAllActivityTabs = {
  involvements: {
    key: 'involvements',
    label: 'Involvements',
    sectionId: SECTION_IDS.involvement,
    component: Involvements,
  },
  achievements: {
    key: 'achievements',
    label: 'Achievements',
    sectionId: SECTION_IDS.achievements,
    component: Achievements,
  },
  publications: {
    key: 'publications',
    label: 'Publications',
    sectionId: SECTION_IDS.publications,
    component: Publications,
  },
  researchInterests: {
    key: 'researchInterests',
    label: 'Research Interests',
    sectionId: SECTION_IDS.researchInterests,
    component: ResearchInterests,
  },
};

const ActivitiesLayout = () => {
  const [activeTab, setActiveTab] = useState(
    allActivityTabs[useEditorStore.getState().target.panel ?? 'involvements'] ??
      allActivityTabs.involvements
  );

  const changeActiveTab = (_event: SyntheticEvent, key: string) => {
    const selectedTab = allActivityTabs[key];
    if (selectedTab) {
      setActiveTab(selectedTab);
    }
  };

  return (
    <Fragment>
      <BasicHeader
        activeTab={activeTab}
        changeActiveTab={changeActiveTab}
        tabs={allActivityTabs}
      ></BasicHeader>
      {activeTab && (
        <SectionVisibilityControl sectionId={activeTab.sectionId} label={activeTab.label} />
      )}
      <BasicPanel activeTab={activeTab} />
    </Fragment>
  );
};

export default ActivitiesLayout;
