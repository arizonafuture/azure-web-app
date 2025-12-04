"use client";

import React from "react";
import parse from "html-react-parser";
import { cleanRichText } from "@/app/utils/extractRichText";
import { ContentRendererProps } from "@/app/types";

const RichDescriptionSection: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  if (!content?.properties?.description) return null;

  const sectionId = settings?.properties?.sectionId || "";
  const html = cleanRichText(content.properties.description);

  return (
    <section id={sectionId}>
      <div className="w-full bg-[var(--lighter-blue-color)] px-[15px] md:px-[70px] py-7.5 md:py-10">
        <div className="body-text-large text-dark-blue text-center">
          {parse(html)}
        </div>
      </div>
    </section>
  );
};

export default RichDescriptionSection;
