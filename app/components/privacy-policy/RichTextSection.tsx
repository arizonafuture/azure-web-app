"use client";

import React from "react";
import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";
import { ContentRendererProps } from "@/app/types";

const PrivacyPolicy = ({ content }: ContentRendererProps) => {
    const richText = content?.properties?.richText;

    if (!richText) return null;

    // Clean + sanitize Umbraco RTE
    const html = cleanRichText(richText);

    return (
        <div className="min-h-screen bg-lighter-orange-color flex justify-center py-25">

            <div
                className="
          max-w-4xl w-full
          mx-6 md:mx-auto
          body-text-large
          text-[var(--blue-color)]
          !leading-[1.6]
          space-y-6

          [&_h1]:heading-1 [&_h1]:font-bold [&_h1]:text-dark-blue [&_h1]:mb-4
          [&_h2]:heading-4 [&_h2]:text-dark-blue [&_h2]:mt-12 [&_h2]:mb-4
          [&_p]:mb-4
          [&_a]:font-semibold [&_a]:underline [&_a]:text-[var(--dark-blue-color)]
          [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2
        "
            >
                <RichText html={html} />
            </div>
        </div>

    );
};

export default PrivacyPolicy;
