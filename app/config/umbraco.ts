// src/config/umbraco.ts
// Centralized Umbraco config (media base, API paths, etc.)

// API base URL for convenience
export const API_BASE_URL = process.env.NEXT_PUBLIC_UMBRACO_BASE_URL;
export const CONTENT_ITEM_API_URL = `/umbraco/delivery/api/v2/content/item`;
export const CONTENT_CHILDREN_API_URL = `/umbraco/delivery/api/v2/content?fetch=children:`;
// Forms API base URL
export const FORMS_API_BASE_URL = `${API_BASE_URL}/umbraco/forms/delivery/api/v1`;

// Custom upload API URL
export const UPLOAD_RESUME_API_URL = `${API_BASE_URL}/api/custom/upload-resume`;

export const ResourceApiUrl = "/api/ResourceSearch";
export const ExpertsSearchApiUrl = "/api/ExpertsSearch";
export const HeaderApiUrl = "/api/Header/GetHeaderData";
export const MoreExpertsApiUrl = "/api/ExpertsSearch/GetTopExperts";
export const MoreUpcomingSession =
  "/api/InfoSessionSearch/GetMoreUpcomingSession";
export const MEMBER_API_BASE_URL = `${API_BASE_URL}/umbraco/api/members`;
export const API_SECURITY_TOKEN_URL = `${API_BASE_URL}/api/security/token`;
export const Info_UPCOMING_API_BASE_URL = `${API_BASE_URL}/api`;
export const SITE_SEARCH_API_URL = `${API_BASE_URL}/api/sitesearch`;
export const UMBRACO_FORM_GET = `${API_BASE_URL}/api/Forms/GetFormDefinition?formId=`;
export const UMBRACO_FORM_POST = `${API_BASE_URL}/api/forms/submit`;
//export const UMBRACO_FORM_POST = `${API_BASE_URL}/umbraco/forms/delivery/api/v1/entries`;
export const UMBRACO_404 = `${API_BASE_URL}/umbraco/delivery/api/v2/content/item/not-found/`;
export const SIGNUP_FORM_ID = `c56ddb62-cbb2-4cf4-a10a-456b4f723bd8`;
