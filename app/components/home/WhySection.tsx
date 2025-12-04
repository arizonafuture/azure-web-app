"use client";

import React from "react";
import { MediaItem, Item, ContentRendererProps } from "../../types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import CardGrid from "./WhySectionCardItem";
import { WhatYouWillFindProps } from "@/app/types/home/WhatYouWillFindProps";



const WhatYouWillFindSection: React.FC<ContentRendererProps> = ({ content }) => {
    const { heading, subHeadline, description, backgroundImages, cards } =
        content?.properties as WhatYouWillFindProps || {};

    const bgImage =
        backgroundImages?.length
            ? buildMediaUrl(backgroundImages[0].url)
            : "";

    return (
        <section
            className="relative w-full px-[15px] md:px-[135px] py-10 md:py-20 overflow-hidden"
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backgroundImage: "url(/img/what-you-will-find.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Content Container */}

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="text-left mb-6 md:mb-10">
                    {heading && (
                        <h2 className="heading-2 !font-bold text-dark-blue mb-4">
                            {heading}
                        </h2>
                    )}

                    {subHeadline && (
                        <h5 className="heading-5 !font-bold text-dark-blue mb-4">
                            {subHeadline}
                        </h5>
                    )}

                    {description && (
                        <p className="body-text text-dark-blue max-w-5xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Card Grid Component */}
                {cards?.items && <CardGrid items={cards.items} />}
            </div>
        </section>
    );
};

export default WhatYouWillFindSection;
