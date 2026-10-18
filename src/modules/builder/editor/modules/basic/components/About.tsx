/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from 'react';
import { RichtextEditor } from '@/helpers/common/components/richtext';
import { SectionVisibilityControl } from '@/modules/builder/editor/components/SectionVisibilityControl';
import { SECTION_IDS } from '@/templates/designs/registry/sectionIds';

const About = ({
  basicTabs,
  onChangeHandler,
}: {
  basicTabs: any;
  onChangeHandler: (value: any, key: string) => void;
}) => {
  return (
    <Fragment>
      <div className="flex flex-col gap-2">
        <SectionVisibilityControl sectionId={SECTION_IDS.summary} label="Summary" />
        <RichtextEditor
          label="About me"
          value={basicTabs.summary}
          onChange={(htmlOutput) => {
            onChangeHandler(htmlOutput, 'summary');
          }}
          name="summary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <SectionVisibilityControl sectionId={SECTION_IDS.objective} label="Career objective" />
        <RichtextEditor
          label="Career objective"
          value={basicTabs.objective}
          onChange={(htmlOutput) => {
            onChangeHandler(htmlOutput, 'objective');
          }}
          name="objective"
        />
      </div>
    </Fragment>
  );
};

export default About;
