"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../common/Button";
import { ContentRendererProps } from "@/app/types";
import { ArizonansValueProps } from "@/app/types/key-topics/ArizonansValueProps";
import { useRouter } from "next/navigation";
import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";

const ArizonansValueSection = ({ content, settings }: ContentRendererProps) => {
    const router = useRouter();
    const {
        heading,
        description,
        ctaHeading,
        cta,
        multiplecta,
        block
    } = content.properties as ArizonansValueProps;

    // support both "cta" and "multiplecta"
    const ctaButtons = multiplecta?.length ? multiplecta : cta || [];

    const sectionId = settings?.properties?.sectionId || "";

    // Convert Umbraco JSON → simplified category object
    const categories =
        block?.items?.map((item) => ({
            id: item.content.id,
            title: item.content.properties.headline,
            html: cleanRichText(item.content.properties.descriptionText),
        })) || [];

    const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || "");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(
        new Set([categories[0]?.id])
    );

    const toggleAccordion = (id: string) => {
        if (expandedItems.has(id)) setExpandedItems(new Set());
        else setExpandedItems(new Set([id]));
    };

    const activeCategory = categories.find((c) => c.id === activeTab);

    return (
        <section
            className="bg-white min-h-screen py-10 md:py-20"
            id={sectionId}
        >
            {/* Header */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">
                <h2 className="heading-2 text-dark-blue mb-6">{heading}</h2>

                {description && (
                    <p className="body-text-large text-dark-blue mb-6 md:mb-10">{description}</p>
                )}
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:block w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] pb-12">
                <div className="flex gap-0 mb-0">
                    {categories.map((category, index) => {
                        const isFirst = index === 0;
                        const isLast = index === categories.length - 1;
                        const isActive = activeTab === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.id)}
                                className={`
                  flex-1 text-center px-6 py-4 transition-all duration-200
                  ${isActive
                                        ? "bg-dark-blue text-white"
                                        : "bg-light-blue text-dark-blue"
                                    }
                  ${isFirst ? "rounded-tl-2xl" : ""}
                  ${isLast ? "rounded-tr-2xl" : ""}
                  ${!isLast ? "border-r border-[rgba(39,47,105,0.5)]" : ""}
                `}
                            >
                                <h6
                                    className="body-text !font-bold"
                                >
                                    {category.title}
                                </h6>
                            </button>
                        );
                    })}
                </div>

                {/* Active Desktop Content */}
                <div className="bg-dark-blue rounded-b-2xl p-8 md:p-10">
                    {activeCategory && (
                        <>
                            <h4 className="heading-4 text-white mb-6">
                                {activeCategory.title}
                            </h4>

                            <RichText
                                html={activeCategory.html}
                                className="body-text text-white mb-6"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Accordion */}
            <div className="lg:hidden w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] pb-12">
                <div className="flex flex-col gap-3">
                    {categories.map((category) => {
                        const isExpanded = expandedItems.has(category.id);

                        return (
                            <div key={category.id} className="flex flex-col">
                                <button
                                    onClick={() => toggleAccordion(category.id)}
                                    className={`
                    flex items-center justify-between px-6 py-4 transition-all duration-200
                    ${isExpanded
                                            ? "bg-dark-blue text-white rounded-t-2xl"
                                            : "bg-light-blue text-dark-blue rounded-3xl"
                                        }
                  `}
                                >
                                    <h6
                                        className='body-text !font-bold text-left !font-["Times_New_Roman"]'
                                    >
                                        {category.title}
                                    </h6>

                                    {isExpanded ? (
                                        <FiChevronUp className="text-xl flex-shrink-0 ml-4 text-white" />
                                    ) : (
                                        <FiChevronDown className="text-xl flex-shrink-0 ml-4 text-dark-blue" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="bg-dark-blue rounded-b-3xl px-6 py-6">
                                        <h2 className="heading-3 text-white mb-4">
                                            {category.title}
                                        </h2>

                                        <RichText
                                            html={category.html}
                                            className="body-text text-white mb-6"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] pb-16">
                <h5 className="heading-5 text-dark-blue font-bold text-center mb-6">
                    {ctaHeading}
                </h5>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    {ctaButtons.map((cta, index) => {
                        const buttonPath = cta?.route?.path || cta?.url || "#";

                        return (
                            <Button
                                key={index}
                                onClick={() => router.push(buttonPath)}
                                variant="orange"
                                showArrow={true}
                            >
                                {cta?.title}
                            </Button>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};

export default ArizonansValueSection;
