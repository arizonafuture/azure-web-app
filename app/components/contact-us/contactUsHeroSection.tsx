"use client";

import { ContentRendererProps } from "@/app/types";
import { ContactUsHerosectionProps } from "@/app/types/contact-us/ContactUsHerosection";

const ContactUsHerosection = ({ content }: ContentRendererProps) => {
  const { title, subText } = content.properties as ContactUsHerosectionProps;

  const titleLines = Array.isArray(title) ? title : [title];

  return (
    <div
    className={
      "bg-dark-blue relative pt-15 md:pt-30 pb-55 px-4 sm:px-8 md:px-16 lg:px-[135px] flex flex-col gap-6 items-center justify-center"
    }
    >
      <div className="flex flex-col gap-[34px] items-center justify-start shrink-0 w-full max-w-5xl relative z-10">
        <div className="flex flex-col gap-2 md:gap-4 items-center justify-start self-stretch shrink-0 relative">
          {/* Title (same structure as AuthPageHeader) */}
          <h1
            className="
              heading-1 text-white text-center leading-tight relative self-stretch
            "
          >
            {titleLines.map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </h1>

          {/* Subtext */}
          {subText && (
            <p
              className="
                subhead text-[var(--lighter-blue-color)] text-center leading-relaxed relative
              "
            >
              {subText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsHerosection;
