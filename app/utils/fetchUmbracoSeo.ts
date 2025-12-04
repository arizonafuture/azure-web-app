import axios, { AxiosError } from "axios";
import https from "https";
import { CONTENT_ITEM_API_URL } from "../config/umbraco";
import { UmbracoSeoResponse } from "../types";

// 🔥 Create HTTPS agent to allow self-signed certificates (local development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function getUmbracoSeo(
  pathname: string
): Promise<UmbracoSeoResponse | null> {
  const cleanPath = pathname === "/" ? "/" : pathname;

  const baseUrl = process.env.NEXT_PUBLIC_UMBRACO_BASE_URL;

  if (!baseUrl) {
    console.error("❌ Missing UMBRACO_BASE_URL environment variable");
    return null;
  }

  const url = `${baseUrl}${CONTENT_ITEM_API_URL}/${encodeURIComponent(
    cleanPath
  )}?fields=properties[metaTitle,metaDescription,openGraphTitle,openGraphDescription,metaKeyword,pageTitle]`;
  try {
    const response = await axios.get<UmbracoSeoResponse>(url, {
      httpsAgent, // 🔥 FIX: allow https with self-signed cert
      headers: { "Cache-Control": "no-cache" },
      timeout: 10000, // prevent ECONNRESET due to slow local SSL handshake
    });
    console.log(response.data)
    return response.data;
    
  } catch (err) {
    const errorMessage =
      err instanceof AxiosError
        ? err.response?.data || err.message
        : "Unknown error fetching SEO";

    console.error("❌ Umbraco SEO Axios Error:", errorMessage);
    return null;
  }
}
