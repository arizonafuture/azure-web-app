"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import Button from "../common/Button";
import { API_BASE_URL, MoreExpertsApiUrl } from "@/app/config/umbraco";
import { ExpertsSearchResponse } from "@/app/types/expert/ExpertsSearchResponse";
import { ContentRendererProps, LinkItem } from "@/app/types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import ExpertCard from "./ExpertCard";
import { getTopExpertExcludingSlug } from "@/app/service/search/search";
import ExpertCardSlider from "./ExpertCardSlider";

const FindMoreExperts: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;
  const { headline, cta } = properties as {
    headline?: string;
    cta?: LinkItem[];
  };
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [experts, setExperts] = useState<ExpertsSearchResponse[]>([]);
  const isScrollingRef = useRef(false);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const slug = pathname.split("/").filter(Boolean).pop();
  useEffect(() => {
    if (!slug) return;

    getTopExpertExcludingSlug(slug)
      .then((results) => {
        setExperts(results);
      })
      .catch((err) => console.error("Error fetching experts:", err));
  }, [slug]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardsPerSlide = 1;
  const totalSlides = Math.ceil(experts.length / cardsPerSlide);

  // Update slide index on scroll
  useEffect(() => {
    if (!scrollContainerRef.current || !isMobile) return;

    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const firstCard = container.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const newSlide = Math.round(container.scrollLeft / (cardWidth + gap));

        if (newSlide !== currentSlide) setCurrentSlide(newSlide);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile, currentSlide]);

  // Scroll to slide
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const firstCard = container.firstElementChild as HTMLElement;

    if (firstCard) {
      isScrollingRef.current = true;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24;

      container.scrollTo({
        left: currentSlide * (cardWidth + gap),
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, [currentSlide, isMobile]);

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

  return (
    <section className="bg-dark-blue py-10 md:py-20 px-[15px] md:px-[135px]">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-0 md:mb-12">
        <h2 className="heading-3 text-white mb-6">{headline}</h2>
        {/* Desktop button */}
        <div className="hidden md:block">
          <Button
            variant="orange"
            showArrow={true}
            onClick={() => router.push(`${cta?.[0]?.route?.path}`)}
          >
            {cta?.[0]?.title}
          </Button>
        </div>
      </div>
      {/* MOBILE SLIDER */}
      <div
        ref={scrollContainerRef}
        className="flex md:hidden overflow-x-auto gap-6 pb-10 md:pb-4 hide-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {experts.map((expert: ExpertsSearchResponse) => (
          <ExpertCardSlider key={expert.id} expert={expert} isMobile={true} />
        ))}
      </div>
      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {experts.map((expert: ExpertsSearchResponse) => (
          <ExpertCard key={expert.id} expert={expert} />
        ))}
      </div>
      {/* Slider Navigation */}
      <div className="flex items-center justify-center gap-10 md:hidden mb-10">
        <button
          onClick={handlePrev}
          className="text-white hover:text-light-orange transition-colors"
          aria-label="Previous slide"
        >
          <FaArrowLeftLong className="text-2xl" />
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-5">
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
      {/* MOBILE BUTTON */}
      <div className="md:hidden flex justify-center mt-8">
        <Button
          variant="orange"
          showArrow={true}
          onClick={() => router.push(`${cta?.[0]?.route?.path}`)}
        >
          {cta?.[0]?.title}
        </Button>
      </div>
    </section>
  );
};

export default FindMoreExperts;
