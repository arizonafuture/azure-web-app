"use client";

import { ContentRendererProps } from "@/app/layouts/componentMap";
import { LinkItem, MediaItem } from "@/app/types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaCheck,
  FaCross,
  FaTimes,
} from "react-icons/fa";

const ExpertDetail: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;
  const {
    expertname,
    headShot,
    titleAtCompany,
    email,
    phoneNumber,
    linkedInUrl,
    availabilityType,
    locations,
    pointOfContactName,
    pointOfContactEmail,
    pointOfContactPhone,
    cta,
  } = properties as {
    expertname?: string;
    headShot?: MediaItem[];
    titleAtCompany?: string;
    email?: string;
    phoneNumber?: string;
    linkedInUrl?: LinkItem[];
    availabilityType?: string;
    locations?: string[];
    cta?: LinkItem[];
    pointOfContactName: string;
    pointOfContactEmail: string;
    pointOfContactPhone: string;
  };

  return (
    <section className="bg-dark-blue text-white py-10 md:py-20 px-[15px] md:px-[70px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
        {/* LEFT CONTENT */}
        <div className="order-2 md:order-1">
          {/* Name */}
          <h1 className="heading-2 mb-2 md:mb-4">{expertname}</h1>

          {/* Position */}
          <p
            className="text-white subhead leading-relaxed !italic"
          >
            {titleAtCompany}
          </p>

          {/* Organization */}
          <p className="text-white mb-4 md:mb-6 subhead leading-relaxed">
            {locations && locations[0]}
          </p>

          {/* CONTACT INFO */}
          <div className="space-y-2">
            {/* Email (ALWAYS SHOWN) */}
            <div className="flex items-center space-x-2.5 md:space-x-4">
              <FaEnvelope className="text-light-orange text-[15px] md:text-[20px]" />
              <span className="body-text-large !leading-[1.6]">
                {email}
              </span>
            </div>

            {/* Phone (ALWAYS SHOWN) */}
            <div className="flex items-center space-x-2.5 md:space-x-4">
              <FaPhone className="text-light-orange text-[15px] md:text-[20px]" />
              <span className="body-text-large !leading-[1.6]">
                {phoneNumber}
              </span>
            </div>

            {/* Optional LinkedIn */}
            {linkedInUrl && (
              <div className="flex items-center space-x-2.5 md:space-x-4 md:mb-6">
                <FaLinkedin className="text-light-orange text-[15px] md:text-[20px]" />
                <a
                  href={`https://linkedin.com/in/${linkedInUrl[0].url}`}
                  target="_blank"
                  className="body-text-large !leading-[1.6]"
                >
                  {linkedInUrl[0].title}
                </a>
              </div>
            )}

            {/* Optional "on the record" flag */}
            {availabilityType &&
            availabilityType.toLowerCase() == "on-the-record" ? (
              <div className="hidden md:flex items-center space-x-4 my-6">
                <FaCheck className="text-light-blue text-[15px] md:text-[20px]" />
                <span
                  className="text-light-blue body-text !leading-[1.6]"
                >
                  Able to go on-the-record
                </span>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4 my-6">
                <FaTimes className="text-light-blue text-[15px] md:text-[20px]" />
                <span
                  className="text-light-blue body-text !leading-[1.6]"
                >
                  Unable to go on-the-record
                </span>
              </div>
            )}
            {pointOfContactName &&
              (pointOfContactEmail || pointOfContactPhone) && (
                <h6 className="heading-6 !font-bold">
                  For requests, copy {pointOfContactName}:
                </h6>
              )}

            {pointOfContactEmail && (
              <div className="flex items-center space-x-2.5 md:space-x-4">
                <FaEnvelope className="text-light-orange text-[15px] md:text-[20px]" />
                <span className="body-text-large !leading-[1.6]">
                  {pointOfContactEmail}
                </span>
              </div>
            )}
            {pointOfContactPhone && (
              <div className="flex items-center space-x-2.5 md:space-x-4">
                <FaPhone className="text-light-orange text-[15px] md:text-[20px]" />
                <span className="body-text-large !leading-[1.6]">
                  {pointOfContactPhone}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-end order-1 md:order-2">
          <img
            src={
              headShot && headShot[0]?.url
                ? buildMediaUrl(headShot[0].url)
                : "/img/expertPlaceholder.png"
            }
            alt={expertname || "Expert Headshot"}
            className="w-[360px] h-[360px] sm:w-[260px] sm:h-[260px] md:w-[400px] md:h-[400px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};
export default ExpertDetail;
