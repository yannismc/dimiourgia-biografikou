// 14.55px at 0.86 is about 9.4pt: below this, report overflow instead of hiding text.
export const MIN_ACADEMIC_SCALE = 0.86;

export function fitAcademicPage(availableHeight: number, measure: (scale: number) => number) {
  if (availableHeight <= 0) return { scale: 1, overflow: 0, ready: false };
  if (measure(1) <= availableHeight) return { scale: 1, overflow: 0, ready: true };
  const smallestHeight = measure(MIN_ACADEMIC_SCALE);
  if (smallestHeight > availableHeight) {
    return { scale: MIN_ACADEMIC_SCALE, overflow: smallestHeight - availableHeight, ready: true };
  }
  let lower = MIN_ACADEMIC_SCALE;
  let upper = 1;
  for (let i = 0; i < 10; i++) {
    const middle = (lower + upper) / 2;
    if (measure(middle) <= availableHeight) lower = middle;
    else upper = middle;
  }
  return { scale: lower, overflow: 0, ready: true };
}
