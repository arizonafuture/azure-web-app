"use client";

import React from "react";
import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { ContentRendererProps } from "@/app/types";
import { ImageWithDescriptionProps } from "@/app/types/about-us/ImageWithDescriptionProps";

const ImageWithDescription: React.FC<ContentRendererProps> = ({ content }) => {
  if (!content?.properties) return null;

  const { headLine, imageSide, image, description } =
    content.properties as ImageWithDescriptionProps;

  const imageUrl = image?.length ? buildMediaUrl(image[0].url) : "";
  const isImageRight = imageSide?.toLowerCase() === "right";

  // Clean + sanitize RTE text
  const html = cleanRichText(description);

  return (
    <section className="w-full bg-lighter-orange py-10 md:py-20 px-[15px] md:px-[70px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-17.5">

        {/* 🖼 Image */}
        {imageUrl && (
          <div
            className={`flex justify-center ${isImageRight
              ? "md:justify-end order-1 md:order-2"
              : "md:justify-start"
              }`}
          >
            <img
              src={imageUrl}
              alt={image?.[0]?.name || "Image"}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        )}

        {/* 📄 Content */}
        <div className={`${isImageRight ? "md:order-1" : "md:order-2"}`}>
          {headLine && (
            <h2 className="heading-2 text-[var(--dark-blue-color)] leading-tight mb-2 md:mb-4">
              {headLine}
            </h2>
          )}

          {/* Render sanitized Umbraco RTE */}
          <RichText
            html={html}
            className="
              body-text-large text-[var(--blue-color)] leading-relaxed space-y-6
            "
          />
        </div>
      </div>
    </section>
  );
};

export default ImageWithDescription;
