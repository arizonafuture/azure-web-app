"use client";

import { ContentRendererProps } from "@/app/layouts/componentMap";
import { BiBookReader } from "react-icons/bi";
import RichText from "@/app/components/common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";
import { FaUser } from "react-icons/fa";

const ExpertBiography: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;

  const { biography, expertise } = properties as {
    biography: { markup: string };
    expertise?: string[];
  };

  const sanitizedBio = cleanRichText(biography?.markup || "");

  return (
    <section className="bg-[var(--lighter-blue-color)] py-10 md:py-20 px-[15px] md:px-[70px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">

        {/* LEFT BOX – Topic Expertise */}
        <div className="flex-1">
          {/* Header */}
          <div className="relative top-[25px] md:top-[35px] bg-light-blue rounded-full px-5 md:px-7.5 py-2.5 md:py-4 flex items-center gap-3">
            <BiBookReader className="text-dark-blue text-lg md:text-[24px]" />
            <h3 className="text-dark-blue heading-4">Topic Expertise</h3>
          </div>

          {/* Expertise List */}
          <div className="bg-white rounded-b-[25px] rounded-t-none md:p-7.5 pl-5 pr-5 pt-5 pb-7.5">
            <ul
              className="list-disc pl-5 md:pl-7.5 pt-5 space-y-2 text-[var(--dark-blue-color)] body-text-large !leading-[1.6]"
            >
              {expertise?.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT BOX – Biography */}
        <div className="md:col-span-2 mt-4 md:mt-8">
          <h2
            className="heading-3 text-dark-blue mb-2 md:mb-4 -mt-4 md:mt-0"
          >
            Biography
          </h2>

          {/* Rich Text Biography */}
          <RichText
            html={sanitizedBio}
            className="space-y-2 md:space-y-4 text-[var(--blue-color)] leading-relaxed body-text-large"
          />
        </div>
      </div>
    </section>
  );
};

export default ExpertBiography;
