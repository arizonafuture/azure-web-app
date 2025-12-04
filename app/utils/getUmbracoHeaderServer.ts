import axios, { AxiosError } from "axios";
import https from "https";
import {
  API_BASE_URL,
  CONTENT_ITEM_API_URL,
  HeaderApiUrl,
} from "../config/umbraco";
import { HeaderResponse } from "../types";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function getUmbracoHeaderServer(): Promise<HeaderResponse | null> {
  const url = `${API_BASE_URL}${HeaderApiUrl}`;
  try {
    const response = await axios.get<HeaderResponse>(url, {
      httpsAgent, // FIX: allow https with self-signed cert
      headers: { "Cache-Control": "no-cache" },
      timeout: 10000, // prevent ECONNRESET due to slow local SSL handshake
    });
    return response.data;
  } catch (err) {
    const errorMessage =
      err instanceof AxiosError
        ? err.response?.data || err.message
        : "Unknown error fetching SEO";

    console.error("Umbraco SEO Axios Error:", errorMessage);
    return null;
  }
}
