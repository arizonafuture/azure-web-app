import { API_BASE_URL, CONTENT_ITEM_API_URL } from "../config/umbraco";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function getContentByPath(path: string) {
  // home page: use base URL
  const apiUrl =
    path === ""
      ? `${API_BASE_URL}${CONTENT_ITEM_API_URL}`
      : `${API_BASE_URL}${CONTENT_ITEM_API_URL}${path}`;

  const res = await fetch(apiUrl, { cache: "no-store" });

  if (!res.ok) {
    console.error("API failed for:", apiUrl);
    throw new Error("Failed to fetch content");
  }

  return res.json();
}
