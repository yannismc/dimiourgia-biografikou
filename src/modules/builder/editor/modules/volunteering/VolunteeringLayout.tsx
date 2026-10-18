import { useState } from 'react';
import { useVoluteeringStore } from '@/stores/volunteering';
import AddVolunteeringExp from './components/AddVolunteering';
import Volunteering from './components/Volunteer';

import MoveEditSection from '@/helpers/common/components/MoveEditSectionContainer';
import { SectionVisibilityControl } from '@/modules/builder/editor/components/SectionVisibilityControl';

const VolunteeringLayout = () => {
  const allVolunteeringExps = useVoluteeringStore((state) => state.volunteeredExps);
  const removeExperience = useVoluteeringStore.getState().remove;
  const onMoveUp = useVoluteeringStore.getState().onmoveup;
  const onMoveDown = useVoluteeringStore.getState().onmovedown;

  const [expanded, setExpanded] = useState<string | false>(allVolunteeringExps[0]?.id ?? false);

  const handleChange = (panel: string, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex flex-col gap-8 mb-8">
      <SectionVisibilityControl sectionId="volunteer" label="Volunteering" />
      {allVolunteeringExps.map((volunteeringInfo, index) => (
        <MoveEditSection
          key={volunteeringInfo.id}
          title={volunteeringInfo.organization || 'Experience'}
          expanded={expanded === volunteeringInfo.id}
          length={allVolunteeringExps.length}
          index={index}
          clickHandler={() => handleChange(volunteeringInfo.id, expanded !== volunteeringInfo.id)}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={removeExperience}
        >
          <Volunteering volunteeringInfo={volunteeringInfo} currentIndex={index} />
        </MoveEditSection>
      ))}
      <AddVolunteeringExp handleChange={handleChange} isEmpty={allVolunteeringExps.length === 0} />
    </div>
  );
};

export default VolunteeringLayout;
