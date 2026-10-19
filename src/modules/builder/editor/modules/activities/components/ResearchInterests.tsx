import { useState, type KeyboardEvent } from 'react';
import { Button, Chip, Stack, TextField } from '@mui/material';
import { useActivity } from '@/stores/activity';

const ResearchInterests = () => {
  const interests = useActivity((state) => state.activities.researchInterests ?? []);
  const [newInterest, setNewInterest] = useState('');

  const addInterest = () => {
    const interest = newInterest.trim();
    if (
      !interest ||
      interests.some((item) => item.toLocaleLowerCase() === interest.toLocaleLowerCase())
    ) {
      return;
    }
    useActivity.getState().updateResearchInterests([...interests, interest]);
    setNewInterest('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addInterest();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {interests.map((interest, index) => (
          <Chip
            key={`${interest}-${index}`}
            label={interest}
            onDelete={() =>
              useActivity
                .getState()
                .updateResearchInterests(interests.filter((_, itemIndex) => itemIndex !== index))
            }
          />
        ))}
      </Stack>
      <div className="flex items-start gap-2">
        <TextField
          label="Research interest"
          variant="filled"
          value={newInterest}
          onChange={(event) => setNewInterest(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          fullWidth
        />
        <Button variant="outlined" onClick={addInterest} disabled={!newInterest.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default ResearchInterests;
