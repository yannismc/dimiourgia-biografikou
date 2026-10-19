type EducationThesisSource = {
  courses?: string[];
  thesisTitle?: string;
  thesisDetails?: string;
};

const cleanTitle = (value: string) =>
  value
    .trim()
    .replace(/^["“‘]/, '')
    .replace(/["”’]$/, '');

export function getEducationThesis(item: EducationThesisSource) {
  const courses = item.courses ?? [];
  const legacyCourseIndex = courses.findIndex((course) =>
    /^\s*thesis(?:\s+topic)?\s*:/i.test(course)
  );
  const legacyCourse = legacyCourseIndex >= 0 ? courses[legacyCourseIndex] : '';
  const legacyText = legacyCourse.replace(/^\s*thesis(?:\s+topic)?\s*:\s*/i, '').trim();
  const divider = legacyText.search(/\s+[–—-]\s+/);
  const legacyTitle = divider >= 0 ? legacyText.slice(0, divider) : legacyText;
  const followingCourse = courses[legacyCourseIndex + 1] ?? '';
  const followingCourseIsDetails =
    legacyCourseIndex >= 0 &&
    divider < 0 &&
    followingCourse.length > 80 &&
    /[.!?]$/.test(followingCourse.trim());
  const legacyDetails =
    divider >= 0
      ? legacyText.slice(divider).replace(/^\s+[–—-]\s+/, '')
      : followingCourseIsDetails
        ? followingCourse
        : '';
  const legacyCourseIndices =
    legacyCourseIndex < 0
      ? []
      : followingCourseIsDetails
        ? [legacyCourseIndex, legacyCourseIndex + 1]
        : [legacyCourseIndex];

  return {
    title: item.thesisTitle?.trim() || cleanTitle(legacyTitle),
    details: item.thesisDetails?.trim() || legacyDetails,
    legacyCourseIndices,
  };
}
