// utils/buildMediaUrl.ts

import { API_BASE_URL } from "../config/umbraco";

export const buildMediaUrl = (relativeUrl: string): string => {
  if (!relativeUrl || relativeUrl.startsWith("http")) {
    return relativeUrl; // Already absolute or empty
  }
  return `${API_BASE_URL}${relativeUrl}`;
};
