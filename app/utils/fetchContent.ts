// app/utils/fetchUmbracoContent.ts

import { API_BASE_URL, CONTENT_ITEM_API_URL } from "../config/umbraco";

export async function fetchContentByPath(currentPath: string) {
  try {
    const fullUrl = `${API_BASE_URL}${CONTENT_ITEM_API_URL}${currentPath}`;
    console.log("fullUrl", fullUrl);
    const res = await fetch(fullUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Umbraco fetch failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("fetchUmbracoContentByPath error:", error);
    throw error;
  }
}
