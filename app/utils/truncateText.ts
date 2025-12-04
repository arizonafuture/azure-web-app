export const truncateText = (text: string, maxLength = 200) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  return truncated.slice(0, truncated.lastIndexOf(" ")).trimEnd() + "...";
};
