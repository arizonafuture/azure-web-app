"use client";

import { useEffect } from "react";
import { API_SECURITY_TOKEN_URL } from "../config/umbraco";

declare global {
  interface Window {
    __CSRF_TOKEN__?: string;
  }
}

export default function CsrfProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function fetchToken() {
      const res = await fetch(API_SECURITY_TOKEN_URL, {
        credentials: "include",
      });

      const { token } = await res.json();
      window.__CSRF_TOKEN__ = token;
    }

    fetchToken();
  }, []);

  return <>{children}</>;
}
