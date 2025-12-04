"use client";

import React, { FC } from "react";
import Button from "../common/Button";
import { FaHandsHelping } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";

import { ContentRendererProps, LinkItem } from "@/app/types";
import { ContactListItems } from "@/app/types/home/contactUsSection";

const NeedAssistance: FC<ContentRendererProps> = ({ content }) => {
  const { properties } = content;

  const { heading, subHeading, contactListItems, getInTouchButton } =
    properties as {
      heading?: string;
      subHeading?: string;
      contactListItems?: ContactListItems;
      getInTouchButton?: LinkItem[];
    };

  // Store icon components
  const iconMap: Record<string, React.ComponentType<any>> = {
    FaHandsHelping: FaHandsHelping,
    GoCommentDiscussion: GoCommentDiscussion,
    FaRegNewspaper: FaRegNewspaper,
  };

  const button = getInTouchButton?.[0];
  const buttonPath = button?.route?.path || button?.url || "#";

  return (
    <section className="w-full py-10 md:py-20 px-4 sm:px-6 md:px-[70px] bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between md:gap-12">
        {/* LEFT SIDE — EXACT STATIC MATCH */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          {heading && (
            <h2 className="heading-2 text-dark-blue mb-2 md:mb-4">
              {heading}
            </h2>
          )}

          {subHeading && (
            <p
              className="body-text-large text-blue !leading-[1.6] md:mb-6"
            >
              {subHeading}
            </p>
          )}

          {/* Button - hidden on mobile, shown in desktop */}
          <div className="hidden md:block">
            {button && (
              <a href={buttonPath}>
                <Button variant="dark-blue" showArrow={true}>
                  {button?.title || "Get in Touch"}
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — EXACT STATIC MATCH */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {contactListItems?.items?.map((item, index) => {
            const { icon, text } = item.content.properties;
            const IconComponent = iconMap[icon];

            return (
              <div key={index}>
                {/* Row */}
                <div className="flex flex-col md:flex-row !items-center md:items-start gap-4 md:gap-5 py-6 md:py-4">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 bg-[radial-gradient(circle,_#D0E6FF_0%,_#A0D0FF_100%)]"
                  >
                    {IconComponent ? (
                      <IconComponent
                        size={32}
                        className="text-[var(--dark-blue-color)]"
                      />
                    ) : (
                      <span className="text-3xl text-[#1A2C47]">{icon}</span>
                    )}
                  </div>

                  <p
                    className="body-text-large text-dark-blue !font-bold flex-1 text-center md:text-left !leading-[1.6]"
                  >
                    {text}
                  </p>
                </div>

                {/* Divider only between rows */}
                {index < contactListItems.items.length - 1 && (
                  <div className="w-full h-px bg-[#E5E7EB]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: Get in Touch button at bottom */}
        <div className="w-full md:hidden flex justify-center">
          {button && (
            <a href={buttonPath}>
              <Button variant="dark-blue" showArrow={true}>
                {button?.title || "Get in Touch"}
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default NeedAssistance;
