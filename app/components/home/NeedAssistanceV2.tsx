"use client";

import React, { FC } from "react";
import Button from "../common/Button";
import { FaHandsHelping } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { ContentRendererProps, LinkItem } from "@/app/types";
import { ContactListItems } from "@/app/types/home/contactUsSection";

const NeedAssistanceV2: FC<ContentRendererProps> = ({ content }) => {
  const { properties } = content;
  const router = useRouter();
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
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        {heading && (
          <h2 className="heading-2 text-dark-blue mb-4">{heading}</h2>
        )}
        {subHeading && (
          <p className="body-text-large text-blue mb-10 max-w-3xl mx-auto">
            {subHeading}
          </p>
        )}
        {/* 3 Cards + Vertical Dividers */}
        <div className="flex flex-col md:flex-row relative">
          {contactListItems?.items?.map((item, index) => {
            const { icon, text } = item.content.properties;
            const IconComponent = iconMap[icon];

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center px-6 py-6 md:py-0 md:px-10 text-center relative"
              >
                {/* MOBILE: Horizontal divider */}
                {index > 0 && (
                  <div className="block md:hidden w-full h-px bg-dark-blue opacity-[0.3] mb-6"></div>
                )}

                {/* DESKTOP: Vertical divider */}
                {index > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-full w-px bg-dark-blue opacity-[0.3]" />
                )}

                {/* Icon in Gradient */}
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-full mb-4 bg-[linear-gradient(180deg,#BFDAF2_0%,#65A1EA_100%)]"
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

                {/* Title */}
                <p className="body-text-large font-bold text-dark-blue">
                  {text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div className="mt-10">
          {button && (
            <Button
              onClick={() => router.push(buttonPath)}
              variant="dark-blue"
              showArrow
            >
              {button?.title || "Get in Touch"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NeedAssistanceV2;
