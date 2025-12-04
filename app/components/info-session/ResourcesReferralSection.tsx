"use client";

import React, { useEffect, useState } from "react";
import { FiDatabase, FiArrowRight } from "react-icons/fi";
import { BsPersonCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface ReferralLink {
  url?: string | null;
  queryString?: string;
  route?: { path?: string | null } | null;
  title?: string;
}

interface ReferralItem {
  content: {
    contentType: string;
    id: string;
    properties: {
      ReferralsTitle: string;
      referralsDescription: string;
      referralsButtonLink?: ReferralLink[];
      icon?: string;
    };
  };
}

interface ResourcesReferralSectionProps {
  content: {
    contentType: string;
    id: string;
    properties: {
      headLine: string;
      referralsItem: {
        gridColumns?: number;
        items: ReferralItem[];
      };
    };
  };
  settings?: {
    properties?: {
      sectionId?: string | null;
    };
  };
}

// Map Umbraco icon string → React Icon component
const iconMap: Record<string, React.ReactNode> = {
  FiDatabase: <FiDatabase size={34} />,
  BsPersonCheckFill: <BsPersonCheckFill size={34} />,
};

const ResourcesReferralSection: React.FC<ResourcesReferralSectionProps> = ({
  content,
  settings,
}) => {
  const { headLine, referralsItem } = content.properties;
  const items = referralsItem?.items || [];
  const sectionId = settings?.properties?.sectionId || "";
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/set-cookie", { cache: "no-store" })
      .then((res) => res.json())
      .then(({ token }) => {
        if (token) setIsLoggedIn(true);
      });
  }, []);

  return (
    <section
      className="w-full bg-light-blue py-10 md:py-20 px-4 md:px-12 lg:px-[70px]"
      id={sectionId}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="heading-2 text-dark-blue mb-6 md:mb-10">{headLine}</h2>

        {/* ✅ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[30px] max-w-[800px] mx-auto">
          {items.map((item, index) => {
            const {
              ReferralsTitle,
              referralsDescription,
              referralsButtonLink,
              icon,
            } = item.content.properties;

            const iconElement = icon ? iconMap[icon] : null;

            // Original links from Umbraco
            const originalLink =
              referralsButtonLink && referralsButtonLink.length > 0
                ? referralsButtonLink[0]
                : null;

            // Original HREF
            const originalHref =
              originalLink?.url || originalLink?.route?.path || "#";
            const queryString = originalLink?.queryString;
            // 🔥 Special Handling Only For Button[1]
            let buttonTitle = originalLink?.title || "";
            let buttonHref = queryString
              ? `${originalHref}${queryString}`
              : originalHref;

            if (index === 1) {
              if (!isLoggedIn) {
                buttonTitle = "Login or Create Account";
                buttonHref = "/register";
              }
            }

            return (
              <div
                key={index}
                className="flex flex-col items-start text-left bg-white rounded-2xl transition-all duration-300 shadow-md w-full h-full mx-auto"
                style={{ maxWidth: "370px", padding: "16px" }}
              >
                {/* Icon */}
                <div className="mb-4 text-red">{iconElement}</div>

                {/* ✅ Title */}
                <h3 className="heading-4 text-dark-blue mb-2">
                  {ReferralsTitle}
                </h3>

                {/* Description */}
                <p className="body-text-small text-dark-blue mb-6 leading-relaxed flex-grow">
                  {referralsDescription}
                </p>

                {/* Button - show always for first, conditional for second */}
                {originalLink && (
                  <a
                    onClick={() => router.push(buttonHref)}
                    className="text-link shrink-0 text-blue !gap-2.5 no-underline"
                  >
                    {buttonTitle}
                    <span className="text-link-icon bg-blue text-white">
                      <FiArrowRight />
                    </span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourcesReferralSection;
