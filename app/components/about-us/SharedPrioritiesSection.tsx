"use client";

import React from "react";
import parse from "html-react-parser";

import {
  FaHandHoldingHeart,
  FaPersonBooth,
  FaBriefcase,
  FaPassport,
} from "react-icons/fa";
import { FaHandFist } from "react-icons/fa6";
import { TbBooks } from "react-icons/tb";
import { MdOutlineWaterDrop } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";
import { BiHome } from "react-icons/bi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import { ContentRendererProps } from "@/app/types";
import { SharedPrioritiesProps } from "@/app/types/about-us/SharedPrioritiesProps";

import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";

import { useRouter } from "next/navigation";

// CMS icon name → React Icon
const iconMap: Record<string, React.ComponentType<any>> = {
  FaHandHoldingHeart,
  FaHandFist,
  TbBooks,
  FaPersonBooth,
  MdOutlineWaterDrop,
  RiMentalHealthLine,
  BiHome,
  FaPassport,
  HiOutlineBuildingOffice2,
  FaBriefcase,
};

export default function SharedPrioritiesSection({
  content,
}: ContentRendererProps) {
  const router = useRouter(); //  <-- FIX: moved inside component

  if (!content?.properties) return null;

  const { headline, shortDescription, iconList, bottomParagraph } =
    content.properties as SharedPrioritiesProps;

  const html = cleanRichText(bottomParagraph?.markup || "");

  return (
    <section className="w-full bg-[var(--light-blue-color)] py-10 md:py-20 px-[15px] md:px-[135px]">
      <div className="max-w-6xl mx-auto">
        {headline && (
          <h2 className="heading-2 mb-2 md:mb-4 text-[var(--dark-blue-color)] leading-tight">
            {headline}
          </h2>
        )}

        {shortDescription && (
          <p className="body-text-large text-[var(--dark-blue-color)] leading-relaxed mb-6 md:mb-10">
            {shortDescription}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 md:mb-10">
          {iconList?.items?.map((item, index) => {
            const { urlAndLabel, icon } = item.content.properties;
            const IconComponent = iconMap[icon];

            return (
              <div
                key={item.content.id || index}
                onClick={() =>
                  router.push(
                    item.content.properties.urlAndLabel?.[0]?.route?.path || "/"
                  )
                }
                className="bg-[var(--blue-color)] text-white rounded-2xl flex flex-col items-center justify-center p-5 md:p-7.5 cursor-pointer"
              >
                {IconComponent ? (
                  <IconComponent className="w-10 h-10 mb-3 md:mb-5 text-[var(--light-blue-color)]" />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-md mb-3 md:mb-4" />
                )}
                <p className="heading-5 text-center font-semibold">
                  {item.content.properties.urlAndLabel?.[0]?.title || ""}
                </p>
              </div>
            );
          })}
        </div>

        <div className="body-text text-[var(--dark-blue-color)] leading-relaxed italic">
          {parse(html)}
        </div>
      </div>
    </section>
  );
}
