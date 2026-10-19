export interface IActivity {
  involvements: string;
  achievements: string;
  publications: string;
  researchInterests: string[];
}

export interface IActivityStore {
  activities: IActivity;
  reset: (activityItem: IActivity) => void;
  get: () => IActivity;
  updateInvolvements: (involvements: string) => void;
  updateAchievements: (achievements: string) => void;
  updatePublications: (publications: string) => void;
  updateResearchInterests: (researchInterests: string[]) => void;
}
