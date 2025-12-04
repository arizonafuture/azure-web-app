import {
  Info_UPCOMING_API_BASE_URL,
  MoreUpcomingSession,
  API_BASE_URL,
  ExpertsSearchApiUrl,
  ResourceApiUrl,
  MoreExpertsApiUrl,
} from "@/app/config/umbraco";
import { getAuthCookie } from "@/app/server/authCookies";
/* -----------------------------------------------------------
   🔐 SAFE TOKEN HELPER
----------------------------------------------------------- */
async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};

  const token = await getAuthCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* -----------------------------------------------------------
   🔐 SAFE FETCH WRAPPER WITH AUTH HEADERS
----------------------------------------------------------- */
async function authFetch(url: string, options: RequestInit = {}) {
  const authHeaders = await getAuthHeaders(); // ✅ FIXED (await)

  const headers: HeadersInit = {
    ...(options.headers as HeadersInit),
    ...authHeaders,
  };

  const response = await fetch(url, { ...options, headers });
  return response.json();
}

/* -----------------------------------------------------------
   📅 FETCH INFO SESSIONS (with filters)
----------------------------------------------------------- */
export async function fetchUpcomingSessionsApi(filters: {
  q?: string;
  sessionFormat?: string;
  topic?: string;
  month?: string;
  isInitial: boolean;
  page: number;
  pageSize: number;
    userId?: string;   // <-- ADD THIS

  
}) {
  const params = new URLSearchParams({
    q: filters.q || "",
    sessionFormat: filters.sessionFormat || "",
    topic: filters.topic || "",
    month: filters.month || "",
    isInitial: String(filters.isInitial),
    page: String(filters.page),
    pageSize: String(filters.pageSize),
      userId: filters.userId || "",          // <-- ADD THIS

  });

  return authFetch(
    `${Info_UPCOMING_API_BASE_URL}/InfoSessionSearch?${params.toString()}`
  );
}

/* -----------------------------------------------------------
   🎤 UPCOMING SESSIONS (EXCLUDING CURRENT)
----------------------------------------------------------- */
export async function getUpcomingSessionsExcludingSlug(slug: string) {
  const data = await authFetch(
    `${API_BASE_URL}${MoreUpcomingSession}?excludeUrl=${slug}`
  );

  return data;
}

export async function getTopExpertExcludingSlug(slug: string) {
  const data = await authFetch(
    `${API_BASE_URL}${MoreExpertsApiUrl}?excludeUrl=${slug}`
  );

  return data.results || [];
}

/* -----------------------------------------------------------
   👨‍💼 FETCH EXPERTS
----------------------------------------------------------- */
export async function fetchExpertsApi(filters: {
  q?: string;
  availabilityType?: string;
  topic?: string;
  location?: string;
  page?: number;
  pageSize?: number;
}) {
  const params = new URLSearchParams({
    q: filters.q || "",
    availabilityType: filters.availabilityType || "",
    topic: filters.topic || "",
    location: filters.location || "",
    page: String(filters.page || 1),
    pageSize: String(filters.pageSize || 8),
  });

  return authFetch(`${API_BASE_URL}${ExpertsSearchApiUrl}?${params}`);
}

/* -----------------------------------------------------------
   📚 FETCH RESOURCES
----------------------------------------------------------- */
export async function fetchResourcesApi(filters: {
  q?: string;
  resourceType?: string;
  topic?: string;
  page?: number;
  pageSize?: number;
}) {
  const params = new URLSearchParams({
    q: filters.q || "",
    resourceType: filters.resourceType || "",
    topic: filters.topic || "",
    page: String(filters.page || 1),
    pageSize: String(filters.pageSize || 6),
  });

  return authFetch(`${API_BASE_URL}${ResourceApiUrl}?${params}`);
}
