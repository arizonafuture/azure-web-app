"use client";
import { useState, useRef, useEffect } from "react";
import { FiArrowRight, FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaUsersViewfinder,
} from "react-icons/fa6";
import { HiOutlineComputerDesktop, HiOutlineUser } from "react-icons/hi2";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import { SessionItem } from "@/app/types/info-detail/UpcomingSessionsProps";
import { getUpcomingSessionsExcludingSlug } from "@/app/service/search/search";
import SessionCard from "../info-session/SessionCard";
import ProtectedFallback from "../common/ProtectedFallback";
import Button from "../common/Button";
import { FaCalendarAlt, FaLaptop, FaRegClock, FaRegUser } from "react-icons/fa";
import { ContentRendererProps } from "@/app/types";
import { truncateText } from "@/app/utils/truncateText";

const UpcomingSessions = ({ content }: ContentRendererProps) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isScrollingRef = useRef(false);
  const isDesktopScrollingRef = useRef(false);
  const { headline, seeAllSessionCta, leftArrowClass, rightArrowClass } =
    content.properties;
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const slug = pathname.split("/").filter(Boolean).pop();
  const ctaBtn = seeAllSessionCta?.[0];
  const ctaUrl = ctaBtn?.route?.path || ctaBtn?.url || "/information-sessions";
  const ctaText = ctaBtn?.title || "See All Sessions";
  const fetchSessions = async (slug: any) => {
    try {
      const data = await getUpcomingSessionsExcludingSlug(slug);
      if (data?.status === 401) {
        setUnauthorized(true);
        return;
      }
      setSessions(data?.results);
    } catch (err: any) {
      console.error("❌ Error fetching sessions:", err);
    }
  };
  useEffect(() => {
    fetchSessions(slug);
  }, [slug]);
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate slides (1 card per slide on mobile, 3 on desktop)
  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(sessions.length / cardsPerSlide);

  // Handle scroll to update current slide on mobile
  useEffect(() => {
    if (!scrollContainerRef.current || !isMobile) return;

    const container = scrollContainerRef.current;
    const handleScroll = () => {
      if (isScrollingRef.current) return; // Ignore programmatic scrolls

      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const scrollLeft = container.scrollLeft;
        const newSlide = Math.round(scrollLeft / (cardWidth + gap));
        if (
          newSlide !== currentSlide &&
          newSlide >= 0 &&
          newSlide < totalSlides
        ) {
          setCurrentSlide(newSlide);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, currentSlide, totalSlides]);

  // Scroll to current slide (Mobile)
  useEffect(() => {
    if (scrollContainerRef.current && isMobile) {
      const container = scrollContainerRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        isScrollingRef.current = true;
        const cardWidth = firstCard.offsetWidth;
        const gap = 24; // gap-6 = 24px
        const scrollPosition = currentSlide * (cardWidth + gap);
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        // Reset flag after scroll completes
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    }
  }, [currentSlide, isMobile]);

  // Scroll to current slide (Desktop)
  useEffect(() => {
    if (desktopScrollRef.current && !isMobile) {
      const container = desktopScrollRef.current;
      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        isDesktopScrollingRef.current = true;
        const cardWidth = firstCard.offsetWidth;
        const gap = 24; // gap-6 = 24px
        const scrollPosition = currentSlide * 3 * (cardWidth + gap); // 3 cards per slide
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        // Reset flag after scroll completes
        setTimeout(() => {
          isDesktopScrollingRef.current = false;
        }, 500);
      }
    }
  }, [currentSlide, isMobile]);

  // Handle scroll to update current slide on desktop
  useEffect(() => {
    if (!desktopScrollRef.current || isMobile) return;

    const container = desktopScrollRef.current;
    const handleScroll = () => {
      if (isDesktopScrollingRef.current) return; // Ignore programmatic scrolls

      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const scrollLeft = container.scrollLeft;
        const newSlide = Math.round(scrollLeft / (3 * (cardWidth + gap))); // 3 cards per slide
        if (
          newSlide !== currentSlide &&
          newSlide >= 0 &&
          newSlide < totalSlides
        ) {
          setCurrentSlide(newSlide);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, currentSlide, totalSlides]);
  const handleNext = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next >= totalSlides ? 0 : next;
    });
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => {
      const prevSlide = prev - 1;
      return prevSlide < 0 ? totalSlides - 1 : prevSlide;
    });
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };
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
  const handleDetails = (session: SessionItem) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "canShowSignUp",
        session.signUpCta ? "true" : "false"
      );
    }

    router.push(session.pageUrl);
  };

  return (
    <section className="bg-dark-blue-gradient w-full px-[15px] md:px-[135px] py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 md:px-8 lg:px-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-6 md:gap-4">
          <h2 className="heading-2 text-white">{headline}</h2>
          <Button
            variant="orange"
            showArrow={true}
            className="whitespace-nowrap"
            onClick={() => router.push(ctaUrl)}
          >
            {ctaText}
          </Button>
        </div>

        {/* Event Cards Slider */}
        <div className="relative mb-8">
          {/* Mobile: Horizontal Scrollable Slider */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-7.5 md:pb-4 md:hidden hide-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sessions.map((session) => {
              const TypeIcon = getSessionIcon(session.type[0]);
              return (
                <div
                  key={session.id}
                  className="bg-transparent-gradient rounded-3xl p-4 flex flex-col w-[85%] sm:w-[75%] snap-start flex-shrink-0"
                >
                  {/* Type Tag */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-dark-blue bg-light-blue">
                      <TypeIcon className="text-base" />
                      {session.type}
                    </span>
                  </div>

                  {/* Event Name */}
                  <h3 className="heading-6 text-white mb-3">
                    {session.eventName}
                  </h3>

                  {/* Date and Time */}
                  {session.date && (
                    <div className="flex items-center gap-4 mb-2 md:mb-4 text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-base" />
                        <span>
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-base" />
                        <span>
                          {new Date(session.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className="h-px w-full mb-2 md:mb-4 bg-[var(--lighter-blue-color)]"
                  ></div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-5 flex-1">
                    {session.sessionDescription
                      ? truncateText(session.sessionDescription, 120)
                      : ""}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-6 mt-auto">
                    {session.signUpCta ? (
                      // ENABLED BUTTON
                      <button
                        onClick={() =>
                          router.push(
                            `/session-sign-up?sessionId=${session.id}&formId=${session.formSelection?.formId || ""
                            }`
                          )
                        }
                        className="text-link shrink-0 text-light-orange flex items-center gap-1"
                      >
                        Sign Upss
                        <span className="text-link-icon bg-light-orange text-blue">
                          <FiArrowRight className="text-dark-blue" />
                        </span>
                      </button>
                    ) : (
                      // DISABLED BUTTON
                      <button
                        disabled
                        className="text-link shrink-0 text-gray-500 flex items-center gap-1 opacity-50 cursor-not-allowed"
                      >
                        Sign Up
                        <span className="text-link-icon bg-gray-500 text-blue opacity-50">
                          <FiArrowRight className="text-dark-blue opacity-50" />
                        </span>
                      </button>
                    )}



                    <button
                      onClick={() =>
                        router.push(`${session.pageUrl}?canShowSignUp=${session.signUpCta ? "true" : "false"}`)
                      }
                      className="text-link shrink-0 text-light-orange flex items-center gap-1"
                    >
                      Details
                      <span className="text-link-icon bg-light-orange text-blue">
                        <FiArrowRight className="text-dark-blue" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Horizontal Scrollable Slider */}
          <div
            ref={desktopScrollRef}
            className="hidden md:flex overflow-x-auto gap-6 pb-4 hide-scrollbar scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sessions.map((session) => {
              const TypeIcon = getSessionIcon(session.type[0]);
              return (
                <div
                  key={session.id}
                  className="bg-transparent-gradient rounded-3xl p-6 flex flex-col flex-shrink-0 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  {/* Type Tag */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-dark-blue bg-light-blue">
                      <TypeIcon className="text-base" />
                      {session.type}
                    </span>
                  </div>

                  {/* Event Name */}
                  <h3 className="heading-6 text-white mb-4">
                    {session.eventName}
                  </h3>

                  {session.date && (
                    <div className="flex items-center gap-4 mb-4 text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-base text-light-blue" />
                        <span>
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaRegClock className="text-base text-light-blue" />
                        <span>
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="h-px w-full mb-4 bg-white opacity-[0.3]"></div>

                  {/* Description */}
                  <p className="text-white text-sm mb-6 flex-1">
                    {session.sessionDescription
                      ? truncateText(session.sessionDescription, 120)
                      : ""}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-6 mt-auto">
                    {session.signUpCta ? (
                      // ENABLED BUTTON
                      <button
                        onClick={() =>
                          router.push(
                            `/session-sign-up?sessionId=${session.id}&formId=${session.formSelection?.formId || ""
                            }`
                          )
                        }
                        className="text-link shrink-0 text-light-orange flex items-center gap-1"
                      >
                        Sign Up
                        <span className="text-link-icon bg-light-orange text-blue">
                          <FiArrowRight className="text-dark-blue" />
                        </span>
                      </button>
                    ) : (
                      // DISABLED BUTTON
                      <button
                        disabled
                        className="text-link shrink-0 text-gray-500 flex items-center gap-1 opacity-50 cursor-not-allowed"
                      >
                        Sign Up
                        <span className="text-link-icon bg-gray-500 text-blue opacity-50">
                          <FiArrowRight className="text-dark-blue opacity-50" />
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDetails(session)}
                      className="text-link shrink-0 text-light-orange flex items-center gap-1"
                    >
                      Details
                      <span className="text-link-icon bg-light-orange text-blue">
                        <FiArrowRight className="text-dark-blue" />
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="flex items-center justify-center gap-10 md:gap-4">
          <button
            onClick={handlePrev}
            className="text-white hover:text-light-orange transition-colors"
            aria-label="Previous slide"
          >
            <FaArrowLeftLong className="text-2xl" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-5 md:gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-4 h-4 rounded-full transition-all ${index === currentSlide
                  ? "bg-white w-4 h-4"
                  : "bg-gray-600 w-2 h-2"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="text-white hover:text-light-orange transition-colors"
            aria-label="Next slide"
          >
            <FaArrowRightLong className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingSessions;
