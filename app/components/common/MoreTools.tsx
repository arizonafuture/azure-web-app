"use client";

import { FC } from "react";
import { FiDatabase, FiArrowRight } from "react-icons/fi";
import { BsPersonCheckFill } from "react-icons/bs";

interface ToolCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
}

const MoreTools: FC = () => {
  const tools: ToolCard[] = [
    {
      icon: <FiDatabase size={34} />,
      title: "Searchable Data Resources",
      description:
        "Access verified, local data and resources — including outcome data from credible sources and public opinion research from Center for the Future of Arizona — all in one place.",
      linkText: "Access the Data",
    },
    {
      icon: <BsPersonCheckFill size={34} />,
      title: "Independent Experts",
      description:
        "Connect with Arizona-based experts from across the state ready to share their own perspectives and insights — on the record or off.",
      linkText: "Search our Experts Directory",
    },
  ];

  return (
    <section className="w-full bg-light-blue py-10 md:py-20 px-4 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="heading-2 text-dark-blue mb-6 md:mb-10">
          Find More Tools to Strengthen Your Story
        </h2>
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-[800px] mx-auto">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="flex flex-col items-start text-left bg-white rounded-2xl transition-all duration-300 w-full h-full mx-auto"
              style={{
                maxWidth: "370px",
                padding: "16px",
              }}
            >
              {/* Icon */}
              <div className="mb-4 text-red">{tool.icon}</div>

              {/* Title */}
              <h3 className="heading-4 text-dark-blue mb-4">{tool.title}</h3>

              {/* Description */}
              <p className="body-text-small text-dark-blue mb-6 leading-relaxed flex-grow">
                {tool.description}
              </p>

              {/* Link */}
              <button className="text-link shrink-0 text-blue !gap-2.5">
                {tool.linkText}
                <span className="text-link-icon bg-blue text-white">
                  <FiArrowRight />
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreTools;
