"use client";

import React from "react";
import Button from "../common/Button";
import { useRouter, usePathname } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { ContentRendererProps } from "@/app/types";
import { CurrentLandscapeProps } from "@/app/types/key-topics/CurrentLandscapeProps";

const CurrentLandscape: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { heading, description, keyDataCallOut, exploreLink } =
    content.properties as CurrentLandscapeProps;

  const sectionId = settings?.properties?.sectionId || "";
  const link = exploreLink && exploreLink.length > 0 ? exploreLink[0] : null;
  const href = link?.url || link?.route?.path || "#";
  const router = useRouter();

  return (
    <section
      className="bg-lighter-blue min-h-screen py-10 md:py-20"
      id={sectionId}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">

        {/* Title */}
        <h2 className="heading-2 text-dark-blue text-center mb-2 md:mb-4">
          {heading}
        </h2>

        {/* Description */}
        <p className="body-text-large text-[var(--blue-color)] text-center mb-6 md:mb-10">
          {description}
        </p>

        {/* Statistics Grid */}
        {keyDataCallOut && keyDataCallOut.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-10 justify-items-center">
            {keyDataCallOut.map((text, index) => {
              // Split first word from the rest
              const words = text.trim().split(" ");
              const firstWord = words.shift() || "";
              const remaining = words.join(" ");

              // Bold first word except the 5th item (index 4)
              const firstWordElement =
                index !== 4 ? (
                  <strong className="font-bold">{firstWord}</strong>
                ) : (
                  firstWord
                );

              return (
                <div
                  key={index}
                  className="bg-light-blue rounded-xl w-full max-w-[379px] min-h-[240px] py-[30px] px-5 flex flex-col justify-center items-center gap-5"
                >
                  <p className="body-text !text-xl text-dark-blue text-center font-bold">
                    {firstWordElement} {remaining}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {link && (
          <div className="flex justify-center">
            <Button
              onClick={() => router.push(href)}
              variant="orange"
              showArrow={true}
              className="!break-words !pl-[30px] !pr-[5px] !py-[5px]"
            >
              {link.title || ""}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrentLandscape;