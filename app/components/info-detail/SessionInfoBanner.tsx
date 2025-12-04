"use client";

import {
  FaCalendar,
  FaLaptop,
  FaMapMarkerAlt,
  FaRegUser,
} from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import Button from "../common/Button";
import { ContentRendererProps } from "@/app/types";
import { InfoSectionHeroProps as SessionInfoBannerProps } from "@/app/types/info-detail/InfoSectionHeroProps";
import RichText from "../common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const getSessionIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "online":
      return FaLaptop;
    case "in person":
      return FaRegUser;
    case "hybrid":
      return FaUsersViewfinder;
    default:
      return FaLaptop;
  }
};



const SessionInfoBanner = ({ content, settings }: ContentRendererProps) => {
  console.log("SessionInfoBanner content:", content);
  const {
    heroBannerHeading,
    type,
    dateAndTime,
    duration,
    location,
    joinLink,
    signUpCta,
  } = content.properties as SessionInfoBannerProps;
  console.log("content", content.properties)
  const sectionId = settings?.properties?.sectionId || "";

  // Format date/time from ISO string
  const dateObj = dateAndTime ? new Date(dateAndTime) : null;

  const date = dateObj
    ? dateObj.toLocaleDateString("en-US", { dateStyle: "medium" })
    : null;

  const time = dateObj
    ? dateObj.toLocaleTimeString("en-US", { timeStyle: "short" })
    : null;
  const join = joinLink?.[0];
  const joinUrl = join?.url || join?.route?.path || "#"; // fallback
  console.log("joinUrl", joinUrl);
  const signup = signUpCta?.[0];
  const signupUrl = signup?.url || signup?.route?.path || "#"; // fallback
  console.log("signup", signup)
  console.log("signupUrl", signupUrl);
  // Get icon based on session type
  const SessionIcon = getSessionIcon(type && type?.length > 0 ? type[0] : "");
  const [canShowSignUp, setCanShowSignUp] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("canShowSignUp");
      console.log("stored", stored)
      setCanShowSignUp(stored === "true");
    }
  }, []);
  return (
    <div
      id={sectionId}
      className="bg-[var(--dark-blue-color)] px-[15px] md:px-[70px] md:py-20 py-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* ------------------------ */}
        {/*      MOBILE LAYOUT      */}
        {/* ------------------------ */}
        <div className="flex flex-col items-center gap-4 md:gap-2 lg:hidden">
          {/* Badge */}
          <div className="badge-light">
            {type && (
              <div className="badge-light">
                <SessionIcon className="text-[var(--dark-blue-color)] text-lg" />
                <span className="capitalize">{type}</span>
              </div>
            )}
          </div>

          {/* Title */}
          {heroBannerHeading && (
            <h1
              className="text-white heading-2 text-center leading-tight"
            >
              {heroBannerHeading}
            </h1>
          )}

          {/* CTA Button */}
          {/* CTA Button */}
          <div>
            {/* Sign Up CTA */}
            {canShowSignUp && signup && signupUrl && (
              <div>
                <Button
                  variant="orange"
                  showArrow={true}
                  className="px-8 py-3 text-lg font-bold"
                  onClick={() => {
                    if (signupUrl.startsWith("/")) {
                      window.location.href = signupUrl; // Or router.push(signupUrl)
                    } else {
                      window.open(signupUrl, "_blank");
                    }
                  }}
                >
                  {signup.title || "Sign Up"}
                </Button>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="flex flex-col gap-4 mt-4 w-full">
            {/* Date + Duration */}
            <div className="flex flex-row gap-4">
              <div className="bg-transparent rounded-xl p-6 flex-1 flex flex-col gap-3">
                {date && (
                  <div className="bg-transparent rounded-xl p-6 flex-1 flex flex-col gap-3">
                    <FaCalendar className="text-white text-xl" />
                    <div className="text-white text-left">
                      <div className="text-base font-semibold">{date}</div>
                      {time && <div className="text-lg font-bold">{time}</div>}
                    </div>
                  </div>
                )}
              </div>

              {duration && (
                <div className="bg-transparent rounded-xl p-6 flex-1 flex flex-col gap-3">
                  <IoIosTimer className="text-white text-xl" />
                  <div className="text-white text-left">
                    <div className="text-lg font-bold">{duration}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Online Join Link OR Location */}
            {joinUrl && (
              <div className="bg-transparent rounded-xl p-6 flex flex-row items-center gap-3 w-full">
                <FaLaptop className="text-white text-2xl flex-shrink-0" />
                <a
                  href={joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:opacity-80 transition-opacity text-base font-semibold"
                >
                  {join?.title}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------ */}
        {/*      DESKTOP LAYOUT      */}
        {/* ------------------------ */}
        <div className="hidden lg:flex flex-row gap-25">
          {/* Left */}
          <div className="flex-1 flex flex-col gap-6">
            {type && (
              <div className="badge-light">
                <SessionIcon className="text-[var(--dark-blue-color)] text-lg" />
                <span className="body-text-small">{type}</span>
              </div>
            )}

            {heroBannerHeading && (
              <h1
                className="text-white heading-2 leading-tight"
              >
                {heroBannerHeading}
              </h1>
            )}
            <div className="mt-2">
              {/* Sign Up CTA */}
              {canShowSignUp && signup && signupUrl && signupUrl !== "#" && (
                <div>
                  <Button
                    variant="orange"
                    showArrow={true}
                    className="px-8 py-3 text-lg font-bold"
                    onClick={() => {
                      if (signupUrl.startsWith("/")) {
                        window.location.href = signupUrl; // Or router.push(signupUrl)
                      } else {
                        window.open(signupUrl, "_blank");
                      }
                    }}
                  >
                    {signup.title || "Sign Up"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              {date && (
                <div className="bg-transparent rounded-xl p-5 flex-1 flex flex-col gap-3 md:gap-4">
                  <FaCalendarAlt className="text-white text-2xl" />
                  <div className="text-white text-left !font-normal">
                    {date}
                    {time && ` at ${time}`}
                  </div>
                </div>
              )}

              {duration && (
                <div className="bg-transparent rounded-xl p-6 flex-1 flex flex-col gap-3">
                  <IoIosTimer className="text-white text-2xl" />
                  <div className="text-white text-left">
                    <div className="text-white text-lg">{duration}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Join Link / Location */}
            {/* ONLINE → Show Join Link | IN PERSON/HYBRID → Show Location */}
            {/* ONLINE | IN PERSON | HYBRID LOGIC */}
            {(() => {
              const sessionType = type?.[0]?.toLowerCase();

              // ONLINE
              if (sessionType === "online") {
                return (
                  <div className="bg-transparent rounded-xl p-6 flex flex-col items-start w-full">
                    <FaLaptop className="text-white text-2xl" />
                    <a
                      href={joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-left underline hover:opacity-80 transition-opacity text-base mt-2"
                    >
                      {join?.title}
                    </a>
                  </div>
                );
              }

              // IN PERSON
              if (sessionType === "in person") {
                return location?.markup ? (
                  <div className="bg-transparent rounded-xl p-6 flex flex-col items-start w-full">
                    <FaMapMarkerAlt className="text-white text-3xl" />

                    <div className="text-base font-semibold text-white mt-2 [&_*]:text-white">
                      <RichText html={cleanRichText(location.markup)} />
                    </div>
                  </div>
                ) : null;
              }

              // HYBRID → Show icon + Join link + Location
              if (sessionType === "hybrid") {
                return (
                  <div className="bg-transparent rounded-xl p-6 flex flex-col gap-4 w-full">
                    <div className="flex flex-col items-start">
                      <FaUsersViewfinder className="text-white text-3xl" />
                      <span className="text-white text-base mt-2 font-semibold">
                        Hybrid Session
                      </span>
                    </div>

                    {/* Join Link */}
                    {joinUrl && (
                      <a
                        href={joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"

                        className="text-white underline text-base hover:opacity-80"
                      >
                        {join?.title}
                      </a>
                    )}

                    {/* Safe Location */}
                    {location?.markup && (
                      <div className="text-white text-base font-semibold [&_*]:text-white">
                        <RichText html={cleanRichText(location.markup)} />
                      </div>
                    )}
                  </div>
                );
              }


              return null;
            })()}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInfoBanner;
