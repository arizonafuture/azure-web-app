import { API_BASE_URL } from "../config/umbraco";

export const buildInternalUrl = (path: string): string => {
  if (!path || path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
