import { RichtextEditor } from '@/helpers/common/components/richtext';
import { useActivity } from '@/stores/activity';

const Publications = () => {
  const publications = useActivity((state) => state.activities.publications);

  return (
    <RichtextEditor
      label="Publications"
      value={publications}
      onChange={(htmlOutput) => useActivity.getState().updatePublications(htmlOutput)}
      name="publications"
    />
  );
};

export default Publications;
