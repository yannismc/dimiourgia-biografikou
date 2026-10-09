/** Treat empty rich-text placeholders such as `<p><br></p>` as having no content. */
export const hasContent = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value !== 'string' || value.length === 0) return false;

  const normalized = value
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();

  return normalized.length > 0 || /<(img|svg|video|audio|iframe|hr)\b/i.test(value);
};
