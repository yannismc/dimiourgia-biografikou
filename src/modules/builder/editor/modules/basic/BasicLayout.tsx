import { useEditorStore } from '@/stores/useEditorStore';
import React, { Fragment } from 'react';
import { useBasicDetails } from '@/stores/basic';
import BasicHeader from './components/BasicHeader';
import BasicPanel from './components/BasicPanel';
import { SectionVisibilityControl } from '@/modules/builder/editor/components/SectionVisibilityControl';
import { SECTION_IDS } from '@/templates/designs/registry/sectionIds';

const tabTitles = ['Contacts', 'Links', 'About'];

const BasicLayout = () => {
  const [activeTab, setActiveTab] = React.useState(
    useEditorStore.getState().target.panel === 'About' ? 2 : 0
  );
  const basicTabs = useBasicDetails((state) => state.values);
  const onChangeText = useBasicDetails.getState().reset;

  const changeActiveTab = (_event: React.SyntheticEvent, activeTab: number) => {
    setActiveTab(activeTab);
  };

  return (
    <Fragment>
      <BasicHeader
        activeTab={activeTab}
        changeActiveTab={changeActiveTab}
        tabTitles={tabTitles}
      ></BasicHeader>
      {activeTab === 0 && (
        <SectionVisibilityControl sectionId={SECTION_IDS.contactInfo} label="Contact details" />
      )}
      {activeTab === 1 && (
        <SectionVisibilityControl sectionId={SECTION_IDS.links} label="Links and profiles" />
      )}
      <BasicPanel
        activeTab={activeTab}
        basicTabs={basicTabs}
        onChangeText={onChangeText}
      ></BasicPanel>
    </Fragment>
  );
};

export default BasicLayout;
