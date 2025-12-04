"use client";
import { Content, ContentRendererProps, Settings } from "@/app/types";
import Button from "../common/Button";
import { FaUser, FaNewspaper } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import {
  FeaturedStory,
  SubmitStoryButton,
} from "@/app/types/home/featuredStory";

const FeaturedStories: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;
  const { heading, subHeading, submitStoryButton, featuredStory } =
    properties as {
      heading?: string;
      subHeading?: string;
      submitStoryButton: SubmitStoryButton[];
      featuredStory?: FeaturedStory;
    };
  console.log(submitStoryButton);
  return (
    <section className="bg-dark-blue-gradient relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 xl:px-20">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-6 lg:gap-8">
          {/* Left Side - Title and Description */}
          <div className="flex-1">
            <h2 className="heading-2 !font-bold text-white mb-4 md:mb-6">
              {heading}
            </h2>
            <p className="body-text-large text-light-blue">{subHeading}</p>
          </div>

          {/* Right Side - Submit Your Story Button */}
          <div className="hidden md:block flex-shrink-0 lg:mt-0">
            <a href={submitStoryButton[0]?.route.path}>
              <Button
                variant="orange"
                showArrow={true}
                className="whitespace-nowrap"
              >
                {submitStoryButton[0]?.title}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Story Cards Section */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStory?.items &&
            featuredStory.items.map((item, index) => {
              const { storyTitle, author, category, readMore } =
                item.content.properties;
              const bgColor =
                item.settings?.properties?.backgroundColor || "#FFFFFF";
              const fontColor =
                item.settings?.properties?.fontColor || "#000000";

              const cardFooterColor =
                item.settings?.properties?.cardFooterColor || "#000000";
              return (
                <div
                  key={index}
                  className="rounded-3xl overflow-hidden flex flex-col"
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Card Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    {/* Story Title */}
                    <h4
                      className="heading-4 !font-bold mb-2 leading-tight"
                      style={{
                        color: fontColor,
                      }}
                    >
                      {storyTitle}
                    </h4>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser
                        className="body-text-small"
                        style={{ color: fontColor }}
                      />
                      <span
                        className="body-text-small"
                        style={{
                          color: fontColor,
                        }}
                      >
                        {author}
                      </span>
                    </div>

                    {/* Source */}
                    <div className="flex items-center gap-2 mb-6">
                      <FaNewspaper
                        className="body-text-small"
                        style={{ color: fontColor }}
                      />
                      <span
                        className="body-text-small"
                        style={{
                          color: fontColor,
                        }}
                      >
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <a
                    className={`w-full pl-[30px] pr-[5px] py-[5px] cursor-pointer transition-opacity duration-200 hover:opacity-90 flex items-center justify-between bg-transparent`}
                    href={readMore[0].url}
                  >
                    <span
                      className="flex items-center gap-2 w-full text-left font-bold"
                      style={{
                        color: fontColor,
                      }}
                    >
                      {readMore[0].title}
                    </span>

                    <span className="p-2 bg-white rounded-full">
                      <FiExternalLink className="text-base text-black" />
                    </span>
                  </a>
                </div>
              );
            })}
        </div>
      </div>

      {/* Mobile: Get in Touch button at bottom */}
      <div className="w-full md:hidden flex justify-center">
        <a href={submitStoryButton[0]?.route.path}>
          <Button
            variant="orange"
            showArrow={true}
            className="whitespace-nowrap"
          >
            {submitStoryButton[0]?.title}
          </Button>
        </a>
      </div>
    </section>
  );
};

export default FeaturedStories;
