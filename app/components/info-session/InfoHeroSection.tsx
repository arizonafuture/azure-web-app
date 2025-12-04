"use client";

import React from "react";
import LazyBackground from "../common/lazyload";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { ContentRendererProps } from "@/app/types";
import { InfoHeroSectionProps } from "@/app/types/info-session/InfoHeroSectionProps";

const InfoHeroSection: React.FC<ContentRendererProps> = ({ content }) => {
  const { headline, shortDescription, backGroundImage } =
    content.properties as InfoHeroSectionProps;

  // Background image from Umbraco
  const bgUrl =
    backGroundImage?.[0]?.url ? buildMediaUrl(backGroundImage[0].url) : "";

  // Handle title array or string
  const titleLines = Array.isArray(headline) ? headline : [headline];

  return (
    <div>
      <LazyBackground
        src={bgUrl}
        className="
          pt-20 pb-20 
          px-4 sm:px-8 md:px-16 lg:px-[135px]
          flex flex-col gap-2.5
          items-center justify-end
          self-stretch shrink-0
          relative overflow-hidden
        "
        children={
          <div className="flex flex-col gap-[34px] items-center justify-start shrink-0 w-full max-w-5xl relative z-10">
            <div className="flex flex-col gap-2 md:gap-4 items-center justify-start self-stretch shrink-0 relative">

              {/* Title */}
              <h1 className="heading-1 text-white text-center">
                {titleLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < titleLines.length - 1 && <br />}
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              {shortDescription && (
                <p className="text-lighter-blue text-center subhead sm:text-lg md:text-xl lg:text-2xl leading-relaxed relative self-stretch">
                  {shortDescription}
                </p>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default InfoHeroSection;
