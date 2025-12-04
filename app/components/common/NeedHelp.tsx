"use client";

import { FC } from "react";
import { FaHandsHelping } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { FaRegNewspaper } from "react-icons/fa6";
import Button from "./Button";

interface HelpItem {
  icon: React.ReactNode;
  title: string;
}

const NeedHelp: FC = () => {
  const items: HelpItem[] = [
    {
      icon: (
        <FaHandsHelping size={40} className="text-[var(--dark-blue-color)]" />
      ),
      title: "Request Help With Story Development",
    },
    {
      icon: (
        <FaRegNewspaper size={40} className="text-[var(--dark-blue-color)]" />
      ),
      title: "Share a Recent Article Informed by the Media Institute",
    },
    {
      icon: (
        <GoCommentDiscussion
          size={40}
          className="text-[var(--dark-blue-color)]"
        />
      ),
      title: "Provide General Feedback or Ask a Question",
    },
  ];

  return (
    <section className="bg-white border-t border-gray-200 py-10 md:py-17.5 px-4 md:px-34">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:gap-12">
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-1/2 text-center md:text-left">
          <h2 className="heading-2 text-dark-blue mb-2 lg:mb-4">
            Need Help or Want to Connect?
          </h2>

          <p className="body-text-large text-blue md:mb-6 leading-relaxed">
            Whether you're on deadline, developing a story, or just exploring
            what's possible, we're here to support your work. Reach out anytime
            to:
          </p>

          {/* Button - hidden on mobile, shown in desktop */}
          <div className="hidden md:block">
            <Button variant="dark-blue" showArrow={true}>
              Get in Touch
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {items.map((item, index) => (
            <div key={index}>
              {/* Mobile: Centered vertical stack, Desktop: Horizontal flex */}
              <div className="flex flex-col md:flex-row !items-center md:items-start gap-4 md:gap-5 py-6 md:py-4">
                {/* Gradient Icon Circle */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full flex-shrink-0 bg-[linear-gradient(180deg,#BFDAF2_0%,#65A1EA_100%)]"
                >
                  <div className="scale-75 sm:scale-90 md:scale-100">
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <p className="body-text-large text-dark-blue !font-bold flex-1 text-center md:text-left pt-1 md:pt-0">
                  {item.title}
                </p>
              </div>

              {/* Divider (except last item) */}
              {index < items.length - 1 && (
                <div className="w-full h-px bg-dark-blue opacity-[0.3]" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: Get in Touch button at bottom */}
        <div className="w-full md:hidden flex justify-center">
          <Button variant="dark-blue" showArrow={true}>
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NeedHelp;
