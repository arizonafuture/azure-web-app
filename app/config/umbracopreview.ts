// src/config/umbracopreview.ts
// Configuration and utility for Umbraco preview API

import { API_BASE_URL, CONTENT_ITEM_API_URL } from "./umbraco";

// Preview API key (read from environment variable for security)
const PREVIEW_API_KEY =
  process.env.UMBRACO_PREVIEW_API_KEY || "nX4mP9k@W2vLx!dQ7u1";

// Interface for Umbraco content (matching App.tsx)
export interface UmbracoContent {
  name: string;
  type: string;
  properties: any;
}

// Exported function to fetch preview content
export const fetchPreviewContent = async (
  previewId: string
): Promise<UmbracoContent> => {
  const url = `${API_BASE_URL}${CONTENT_ITEM_API_URL}/${previewId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Preview: "true",
      "Api-Key": PREVIEW_API_KEY,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch preview content: ${response.status} ${text}`
    );
  }

  return response.json();
};
