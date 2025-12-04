"use client";

import React from "react";
import CardGrid from "../home/WhySectionCardItem";
import { ContentRendererProps } from "@/app/types";
import { BuiltForJournalistsProps } from "@/app/types/about-us/BuiltForJournalistsProps";

export default function BuiltForJournalistsSection({
  content,
}: ContentRendererProps) {
  const { headLine, description, cardsTitle, cardList } =
    content.properties as BuiltForJournalistsProps;

  return (
    <div className="w-full bg-[var(--dark-blue-color)] text-white py-10 md:py-20 px-[15px] md:px-[70px]">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        {headLine && (
          <h2 className="heading-2 leading-snug mb-2 md:mb-4">{headLine}</h2>
        )}

        {/* Description */}
        {description && (
          <p className="body-text-large text-white leading-relaxed">
            {description}
          </p>
        )}

        {/* Cards Title */}
        {cardsTitle && (
          <h2 className="heading-5 md:text-xl font-bold mt-6 md:mt-10 mb-4 md:mb-6">
            {cardsTitle}
          </h2>
        )}

        {/* Cards */}
        {cardList?.items && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 text-center">
            {cardList.items.map((card, index) => {
              const { heading, description } = card.content.properties;
              const { backgroundColor, fontColor } =
                card.settings.properties || {};
              return (
                <>
                  <div
                    className="p-6 rounded-3xl"
                    style={{ backgroundColor: backgroundColor || "" }}
                  >
                    <p
                      className="heading-5 leading-relaxed"
                      style={{ color: fontColor || "" }}
                    >
                      {heading}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
