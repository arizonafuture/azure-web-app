import { SITE_SEARCH_API_URL } from "@/app/config/umbraco";
import { getAuthCookie } from "@/app/server/authCookies";

type SearchType = "general" | "experts" | "sessions";

function buildUrl(params: {
  searchTerm: string;
  searchType?: SearchType;
  pageNumber?: number;
  pageSize?: number;
}) {
  const url = new URL(SITE_SEARCH_API_URL);
  url.searchParams.set("searchTerm", params.searchTerm);
  if (params.searchType && params.searchType !== "general") {
    url.searchParams.set("searchType", params.searchType);
  }
  if (typeof params.pageNumber === "number") {
    url.searchParams.set("pageNumber", String(params.pageNumber));
  }
  if (typeof params.pageSize === "number") {
    url.searchParams.set("pageSize", String(params.pageSize));
  }
  return url.toString();
}

export async function fetchSiteSearch(params: {
  searchTerm: string;
  searchType?: SearchType;
  pageNumber?: number;
  pageSize?: number;
}) {
  const token = await getAuthCookie();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(buildUrl(params), { headers, cache: "no-store" });
  if (!res.ok) {
    if (res.status === 400) {
      return { results: [], totalCount: 0 } as any;
    }
    throw new Error(`Search failed ${res.status}`);
  }
  return res.json();
}
