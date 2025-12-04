"use client";

import { ContentRendererProps } from "@/app/types";
import { CurrentLandscapeProps } from "@/app/types/key-topics/CurrentLandscapeProps";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import RichText from "@/app/components/common/RichText";
import Image from "next/image";

import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
const TopicUniquenessSection = ({
  content,
  settings,
}: ContentRendererProps) => {
  const { heading, description, block } =
    content.properties as CurrentLandscapeProps;
  const sectionId = settings?.properties?.sectionId || ""; // ✅ get dynamic section id
  const items =
    block?.items?.map((item: any) => ({
      id: item.content.id,
      title: item.content.properties.headline,
      text: item.content.properties.text,
      imageUrls: (item.content.properties.image || []).map((img: any) =>
        buildMediaUrl(img.url)
      ),
    })) || [];

  const [activeTab, setActiveTab] = useState<string>(items[0]?.id || "");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set([items[0]?.id])
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [isTransitioning, setIsTransitioning] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const activeItem = items.find((item: any) => item.id === activeTab);
    if (activeItem && activeItem.imageUrls.length > 0) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab] ?? 0,
      }));
    }
  }, [activeTab]);

  const toggleAccordion = (id: string) => {
    const newExpanded = new Set<string>();
    if (expandedItems.has(id)) {
      setExpandedItems(newExpanded);
    } else {
      newExpanded.add(id);
      setExpandedItems(newExpanded);
    }
  };

  const goToNextImage = (itemId: string, totalImages: number) => {
    setIsTransitioning((prev) => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [itemId]: ((prev[itemId] ?? 0) + 1) % totalImages,
      }));
      setTimeout(() => {
        setIsTransitioning((prev) => ({ ...prev, [itemId]: false }));
      }, 10);
    }, 300);
  };

  const goToPreviousImage = (itemId: string, totalImages: number) => {
    setIsTransitioning((prev) => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [itemId]: ((prev[itemId] ?? 0) - 1 + totalImages) % totalImages,
      }));
      setTimeout(() => {
        setIsTransitioning((prev) => ({ ...prev, [itemId]: false }));
      }, 10);
    }, 300);
  };

  const activeItem = items.find((i: any) => i.id === activeTab);

  return (
    <section
      className="bg-dark-blue-gradient min-h-screen py-10 md:py-20"
      id={sectionId}
    >
      {/* ✅ Header Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">
        <h2 className="heading-2 text-white mb-2 md:mb-4">{heading}</h2>
        <p className="body-text-large text-lighter-blue mx-auto mb-6 md:mb-10">
          {description}
        </p>
      </div>

      {/* ✅ Desktop Tab Layout */}
      <div className="hidden lg:flex w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px] gap-2">
        {/* Tabs */}
        <div className="w-1/3 flex flex-col gap-2">
          {items.map((item: any) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`text-left px-[25px] py-2.5 !rounded-[20px] transition-all duration-200 ${activeTab === item.id
                ? "bg-white text-dark-blue rounded-xl"
                : "bg-transparent-gradient text-white rounded-xl"
                }`}
            >
              <h6
                className='subhead !font-bold !font-["Times New Roman"]'
              >
                {item.title}
              </h6>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="w-2/3 bg-white rounded-2xl p-8 md:p-10">
          {activeItem && (
            <>
              {activeItem.imageUrls.length > 0 && (
                <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                  <img
                    key={`${activeTab}-${currentImageIndex[activeTab] ?? 0}`}
                    src={
                      activeItem.imageUrls[currentImageIndex[activeTab] ?? 0]
                    }
                    alt={activeItem.title}
                    loading="lazy"
                    className={`object-cover transition-opacity duration-500 ease-in-out ${isTransitioning[activeTab] ? "opacity-0" : "opacity-100"
                      }`}
                  />
                  {activeItem.imageUrls.length > 1 && (
                    <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                      <button
                        onClick={() =>
                          goToPreviousImage(
                            activeTab,
                            activeItem.imageUrls.length
                          )
                        }
                        className="bg-white/40 hover:bg-white rounded-full p-2 transition-all"
                      >
                        <FiChevronLeft className="text-dark-blue text-xl" />
                      </button>
                      <button
                        onClick={() =>
                          goToNextImage(activeTab, activeItem.imageUrls.length)
                        }
                        className="bg-white/40 hover:bg-white rounded-full p-2 transition-all"
                      >
                        <FiChevronRight className="text-dark-blue text-xl" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <h2 className="heading-4 text-dark-blue mb-4">
                {activeItem.title}
              </h2>
              {activeItem.text && (
                <RichText html={activeItem.text} className="body-text text-blue mb-4" />
              )}


            </>
          )}
        </div>
      </div>

      {/* ✅ Mobile Accordion Layout */}
      <div className="lg:hidden w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">
        <div className="flex flex-col gap-3">
          {items.map((item: any) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <div key={item.id} className="flex flex-col">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className={`flex items-center justify-between px-4 py-2.5 transition-all duration-200 ${isExpanded
                    ? "bg-light-blue text-dark-blue rounded-t-2xl"
                    : "bg-transparent-gradient text-white rounded-lg"
                    }`}
                >
                  <h6 className="headline-6 !font-bold text-left">
                    {item.title}
                  </h6>
                  {isExpanded ? (
                    <FiChevronUp className="text-xl flex-shrink-0 ml-4" />
                  ) : (
                    <FiChevronDown className="text-xl flex-shrink-0 ml-4" />
                  )}
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="bg-white rounded-b-lg px-4 py-4">
                    {item.imageUrls.length > 0 && (
                      <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                        <img
                          key={`${item.id}-${currentImageIndex[item.id] ?? 0}`}
                          src={item.imageUrls[currentImageIndex[item.id] ?? 0]}
                          alt={item.title}
                          className={`object-cover transition-opacity duration-500 ease-in-out ${isTransitioning[item.id]
                            ? "opacity-0"
                            : "opacity-100"
                            }`}
                        />

                        {item.imageUrls.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                            <button
                              onClick={() =>
                                goToPreviousImage(
                                  item.id,
                                  item.imageUrls.length
                                )
                              }
                              className="bg-white/40 hover:bg-white rounded-full p-2 transition-all"
                            >
                              <FiChevronLeft className="text-dark-blue text-xl" />
                            </button>
                            <button
                              onClick={() =>
                                goToNextImage(item.id, item.imageUrls.length)
                              }
                              className="bg-white/40 hover:bg-white rounded-full p-2 transition-all"
                            >
                              <FiChevronRight className="text-dark-blue text-xl" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <h2 className="heading-3 text-dark-blue mb-2">
                      {item.title}
                    </h2>

                    {item.text && (
                      <RichText html={item.text} className="body-text text-dark-blue mb-2" />
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

export default TopicUniquenessSection;
