export const normalizeSearchQuery = (query) => {
  return query.trim().replace(/\s+/g, " ");
};

export const buildSnippet = (text, maxLength = 180) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};
