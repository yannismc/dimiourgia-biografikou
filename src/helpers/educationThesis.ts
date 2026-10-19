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
  const legacyCourseIndex =
    item.courses?.findIndex((course) => /^\s*thesis(?:\s+topic)?\s*:/i.test(course)) ?? -1;
  const legacyCourse = legacyCourseIndex >= 0 ? (item.courses?.[legacyCourseIndex] ?? '') : '';
  const legacyText = legacyCourse.replace(/^\s*thesis(?:\s+topic)?\s*:\s*/i, '').trim();
  const divider = legacyText.search(/\s+[–—-]\s+/);
  const legacyTitle = divider >= 0 ? legacyText.slice(0, divider) : legacyText;
  const legacyDetails = divider >= 0 ? legacyText.slice(divider).replace(/^\s+[–—-]\s+/, '') : '';

  return {
    title: item.thesisTitle?.trim() || cleanTitle(legacyTitle),
    details: item.thesisDetails?.trim() || legacyDetails,
    legacyCourseIndex,
  };
}
