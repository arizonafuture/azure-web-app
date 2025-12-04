"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../common/Button";
import { ContentRendererProps } from "@/app/types";
import { CareAboutProps } from "@/app/types/key-topics/CareAboutProps";
import { useRouter } from "next/navigation";
import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";

const CareAboutSection = ({ content, settings }: ContentRendererProps) => {
  const { headline, description, keyIndicatorBlock } =
    content.properties as CareAboutProps;

  const router = useRouter();
  const sectionId = settings?.properties?.sectionId || "";

  /** Normalize Umbraco block items */
  const outcomes =
    keyIndicatorBlock?.items?.map((item: any) => {
      const props = item.content.properties;

      const cta = props.outcomeCta?.[0]; // FIRST CTA
      const href = cta?.url || cta?.route?.path || "#";

      return {
        id: item.content.id,
        title: props.keyIndicator,
        html: cleanRichText(props.definition),
        cta,
        href,
      };
    }) || [];

  /** STATE */
  const [activeTab, setActiveTab] = useState<string>(outcomes[0]?.id || "");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set([outcomes[0]?.id])
  );

  const activeOutcome = outcomes.find((o) => o.id === activeTab);

  const toggleAccordion = (id: string) => {
    const newExpanded = new Set<string>();
    if (!expandedItems.has(id)) newExpanded.add(id);
    setExpandedItems(newExpanded);
  };

  return (
    <section
      className="bg-dark-blue-gradient min-h-screen py-10 md:py-20"
      id={sectionId}
    >
      {/* Header */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">
        <h2 className="heading-2 text-white text-center mb-6">{headline}</h2>

        {description && (
          <p className="body-text-large text-lighter-blue text-center mx-auto mb-6 md:mb-10">
            {description}
          </p>
        )}
      </div>

      {/* ===========================
          DESKTOP VIEW
      =========================== */}
      <div className="hidden lg:flex w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] pb-16 gap-2">
        {/* Left Tabs */}
        <div className="w-1/3 flex flex-col gap-2">
          {outcomes.map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => setActiveTab(outcome.id)}
              className={`text-left px-[25px] py-[10px] rounded-[20px] transition-all duration-200 ${activeTab === outcome.id
                ? "bg-white text-dark-blue"
                : "bg-transparent-gradient text-white"
                }`}
            >
              <h6
                className="heading-6"
              >
                {outcome.title}
              </h6>
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="w-2/3 bg-white rounded-2xl p-8 md:p-10">
          {activeOutcome && (
            <>
              <h2 className="heading-4 text-dark-blue mb-4">
                {activeOutcome.title}
              </h2>

              {/* RICH TEXT */}
              <RichText
                html={activeOutcome.html}
                className="body-text text-blue mb-8"
              />

              {/* CTA (DESKTOP) */}
              {activeOutcome.cta && (
                <Button
                  variant="dark-blue"
                  showArrow={true}
                  onClick={() => router.push(activeOutcome.href)}
                >
                  {activeOutcome.cta.title ||
                    activeOutcome.cta.name ||
                    "Learn More"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===========================
          MOBILE ACCORDION
      =========================== */}
      <div className="lg:hidden w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] pb-16">
        <div className="flex flex-col gap-3">
          {outcomes.map((outcome) => {
            const isOpen = expandedItems.has(outcome.id);

            return (
              <div key={outcome.id} className="flex flex-col">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(outcome.id)}
                  className={`flex items-center justify-between px-6 py-4 transition-all duration-200 ${isOpen
                    ? "bg-light-blue text-dark-blue rounded-t-2xl"
                    : "bg-transparent-gradient text-white rounded-lg"
                    }`}
                >
                  <h6
                    className='body-text !font-bold text-left !font-["Times_New_Roman"]'
                  >
                    {outcome.title}
                  </h6>

                  {isOpen ? (
                    <FiChevronUp className="text-xl ml-4" />
                  ) : (
                    <FiChevronDown className="text-xl ml-4" />
                  )}
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="bg-white rounded-b-lg px-6 py-6">
                    <h2 className="heading-3 text-dark-blue mb-4">
                      {outcome.title}
                    </h2>

                    <RichText
                      html={outcome.html}
                      className="body-text text-dark-blue mb-6"
                    />

                    {/* CTA (MOBILE) */}
                    {outcome.cta && (
                      <Button
                        variant="dark-blue"
                        showArrow={true}
                        onClick={() => router.push(outcome.href)}
                      >
                        {outcome.cta.title ||
                          outcome.cta.name ||
                          "Learn More"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareAboutSection;
