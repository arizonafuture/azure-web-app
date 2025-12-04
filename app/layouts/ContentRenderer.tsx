// src/components/ContentRenderer.tsx
import React from "react";
import { componentMap as baseMap } from "./componentMap";
import { ContentRendererProps } from "../types";
import { getAuthCookie } from "../server/authCookies";
import ProtectedFallback from "../components/common/ProtectedFallback";

const ContentRenderer = async ({
  content,
  settings,
  areas,
  areaGridColumns,
}: ContentRendererProps) => {
  const authToken = await getAuthCookie(); // Server-side cookie read

  // Clone the base component map to avoid mutating shared state
  const componentMap = { ...baseMap };

  /**
   * ============================
   * 🔐 AUTH-BASED COMPONENT RULES
   * ============================
   */

  if (!authToken) {
    // Replace protected components with fallback
    componentMap.upcomingSessionSection = ProtectedFallback;
    componentMap.sessionDetailsSection = ProtectedFallback;
    componentMap.upcomingInformationalSessions = ProtectedFallback;
    componentMap.findMoreIndependentExperts = ProtectedFallback;
    componentMap.independentExpertsSearch = ProtectedFallback;

    // Remove components that require authentication entirely
    delete componentMap.heroBanner;
    delete componentMap.upcomingSessionSection;
    delete componentMap.profileSection;
    delete componentMap.sessionInfoBanner;
    delete componentMap.expertHeroBanner;


  }

  if (authToken) {
    // Remove public-only section for logged-in users
    delete componentMap.mediaAccessSection;

  }

  /**
   * ============================
   * 🎯 SELECT COMPONENT TO RENDER
   * ============================
   */

  const ContentComponent =
    componentMap[content.contentType] || componentMap.default;

  return (
    <ContentComponent
      content={content}
      settings={settings}
      areas={areas}
      areaGridColumns={areaGridColumns}
      authToken={authToken} // optional if children need it
    />
  );
};

export default ContentRenderer;
export type { ContentRendererProps };
