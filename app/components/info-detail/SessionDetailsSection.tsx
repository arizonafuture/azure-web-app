"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiChevronDown, FiChevronUp, FiArrowRight } from "react-icons/fi";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { ContentRendererProps } from "@/app/types";
import { SessionDetailsProps } from "@/app/types/info-detail/SessionDetailsProps";
import RichText from "../common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";



const SessionDetailsSection = ({ content }: ContentRendererProps) => {
  const {
    sessionHeading,
    sessionDescription,
    faqHeadline,
    faqList,
    presentersHeadline,
    presentersList,
  } = content.properties as SessionDetailsProps;




  const presenters =
    presentersList?.items?.map((item: any, index: number) => {
      const p = item?.content?.properties;

      return {
        id: index + 1,
        name: p?.presentername,
        title: p?.position,
        affiliation: p?.university,
        bioLink: p?.bioLink?.[0]?.url || null,
        icon: p?.icon?.[0]
          ? {
            url: buildMediaUrl(p.icon[0].url), // <-- FIXED
            name: p.icon[0].name,
          }
          : null,
      };
    }) ?? [];

  /* ------------------------------- */
  /* Transform FAQs from Umbraco */
  /* ------------------------------- */

  const faqs =
    faqList?.items?.map((item: any, index: number) => {
      const p = item?.content?.properties;
      return {
        id: index + 1,
        question: p?.faqQuestion,
        answer: p?.faqAnswer,
      };
    }) ?? [];

  /* ------------------------------- */
  /* FAQ Accordion */
  /* ------------------------------- */

  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(
    faqs.length > 0 ? faqs[0].id : null
  );

  const toggleFaq = (id: number) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-lighter-blue px-[15px] md:px-[70px] py-10 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* LEFT COLUMN: Presenters */}
          <div className="flex-1 lg:max-w-[400px]">
            {presentersHeadline && (
              <div className="bg-light-blue rounded-full px-5 md:px-7.5 py-2.5 md:py-4 flex items-center gap-4 relative z-10">

                <FaUser className="text-dark-blue text-xl" />
                <h4 className="heading-4 text-dark-blue">
                  {presentersHeadline}
                </h4>
              </div>
            )}

            <div className="relative bottom-[40px] md:bottom-[50px] bg-white pt-10 rounded-3xl overflow-visible">

              {presenters.map((presenter: any, index: number) => (
                <div key={presenter.id}>
                  <div className="pt-5 md:pt-5 pb-4 md:pb-5 pl-5 md:pl-7.5 pr-5 md:pr-7.5 flex flex-row gap-4">
                    {/* Presenter Avatar */}
                    {/* Presenter Avatar */}
                    {presenter.icon?.url ? (
                      <img
                        src={presenter.icon.url}
                        alt={presenter.name}
                        className="w-25 h-25 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-light-blue rounded-lg p-2 h-full flex items-center justify-center self-stretch">
                        <div className="w-20 h-20 rounded-full bg-dark-blue flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-white text-3xl" />
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex flex-col gap-2 flex-1">
                      <h4 className="text-dark-blue body-text-large !font-bold !leading-[1.6]">
                        {presenter.name}
                      </h4>

                      {presenter.title && (
                        <p className="text-blue !italic body-text-small">
                          {presenter.title}
                        </p>
                      )}

                      {presenter.affiliation && (
                        <p className="text-blue body-text-small">
                          {presenter.affiliation}
                        </p>
                      )}

                      {presenter.bioLink && (
                        <a
                          href={presenter.bioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link text-dark-blue mt-2"
                        >
                          Read Bio
                          <span className="text-link-icon bg-blue text-white">
                            <FiArrowRight />
                          </span>
                        </a>
                      )}

                    </div>
                  </div>

                  {index < presenters.length - 1 && (
                    <div className="h-px bg-gray-300 mx-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Details + FAQ */}
          <div className="flex-1 flex flex-col gap-2 md:gap-6">
            {sessionHeading && (
              <h3 className="heading-3 text-dark-blue">{sessionHeading}</h3>
            )}

            {/* Rich Text Description */}
            {/* Rich Text Description */}
            {sessionDescription && (
              <div
                className="
      body-text-large text-blue mb-8 leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6
      [&_li]:mb-2
      [&_p]:mb-3
      [&_*]:text-blue
    "
              >
                <RichText html={cleanRichText(sessionDescription)} />
              </div>
            )}


            {faqHeadline && (
              <h3 className="heading-3 text-dark-blue">{faqHeadline}</h3>
            )}

            {faqs.length > 0 && (
              <div className="flex flex-col gap-0">
                {faqs.map((faq: any, index: number) => {
                  const isExpanded = expandedFaqId === faq.id;

                  return (
                    <div key={faq.id} className="flex flex-col">
                      <div
                        className={`rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? "bg-white" : "bg-transparent"
                          }`}
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="flex items-center justify-between px-[15px] md:px-6 py-[15px] md:py-7.5 w-full text-left"
                        >
                          <h6 className="body-text-large !font-bold text-dark-blue pr-2 md:pr-4 flex-1">
                            {faq.question}
                          </h6>
                          {isExpanded ? (
                            <FiChevronUp className="text-xl flex-shrink-0 text-dark-blue" />
                          ) : (
                            <FiChevronDown className="text-xl flex-shrink-0 text-dark-blue" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 md:px-6 pb-7.5 md:pb-6 pt-0 bg-white rounded-b-xl">
                            <p className="body-text text-blue">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>

                      {index < faqs.length - 1 && !isExpanded && (
                        <div className="h-px bg-gray-300"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsSection;
