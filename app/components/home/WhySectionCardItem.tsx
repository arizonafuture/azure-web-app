"use client";

import React from "react";
import { Item } from "@/app/types";

interface CardGridProps {
  items: Item[];
}

const CardGrid: React.FC<CardGridProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-500 col-span-4 text-center">No cards found.</p>
    );
  }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 text-center">

            {items.map((card, index) => {
                const { heading, description } = card.content.properties;
                const { backgroundColor, fontColor } =
                    card.settings.properties || {};

                return (
                    <div
                        key={card.content.id || index}
                        className="rounded-3xl p-5 md:p-[25px] text-left h-full flex flex-col"
                        style={{ backgroundColor: backgroundColor || "" }}
                    >
                        <h5 className="heading-5 !text-[25px] !font-bold mb-2"
                            style={{ color: fontColor || "" }}
                        >
                            {heading}
                        </h5>
                        <p

                            className="body-text leading-relaxed flex-grow"
                            style={{ color: fontColor || "" }}
                        >
                            {description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default CardGrid;
