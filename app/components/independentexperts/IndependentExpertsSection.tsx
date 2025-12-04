"use client";
import { useState, useEffect, useRef } from "react";
import Pagination from "../common/Pagination";
import Dropdown from "../common/Dropdown";
import {
  FiArrowRight,
  FiCalendar,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { MdMail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import {
  FaMapMarkerAlt,
  FaNewspaper,
  FaRegFile,
  FaRegPlayCircle,
  FaUserCircle,
} from "react-icons/fa";
import { FaTextSlash, FaVolumeHigh } from "react-icons/fa6";
import { API_BASE_URL, ExpertsSearchApiUrl } from "@/app/config/umbraco";
import { useRouter } from "next/navigation";
import { ContentRendererProps } from "@/app/layouts/componentMap";
import { Content, LinkItem, MediaItem } from "@/app/types";
import { Settings } from "http2";
import { truncateText } from "@/app/utils/truncateText";
import Button from "../common/Button";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { TagItem } from "@/app/types/tagItem";
import { ExpertsSearchResponse } from "@/app/types/expert/ExpertsSearchResponse";
import ExpertCard from "../experts/ExpertCard";
import { fetchExpertsApi } from "@/app/service/search/search";
import RichText from "../common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";
import { useSearchParams } from "next/navigation";
import NoSessionFound from "../info-session/NoSessionFound";
import NoExpertsFound from "./NoExpertsFound";
import Loader from "../common/Loader";
// ✅ Match your real Umbraco content structure

const IndependentExpertsSection: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;
  const { description, headline } = properties as {
    description: {
      markup: string;
    };
    headline?: string;
  };
  const searchParams = useSearchParams();
  const queryTopic = searchParams.get("topic") || "";
  const [currentExperts, setCurrentExperts] = useState<ExpertsSearchResponse[]>(
    []
  );
  const [pendingExperts, setPendingExperts] = useState<
    ExpertsSearchResponse[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");
  const [topic, setTopic] = useState(queryTopic || "");
  const [location, setLocation] = useState("");
  const [allAvailabilityTypes, setAllAvailabilityTypes] = useState<string[]>(
    []
  );
  const [allTopics, setAllTopics] = useState<TagItem[]>([]);
  const [allLocations, setAllLocations] = useState<TagItem[]>([]);

  // For search button click
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [noData, setNoData] = useState(false);
  // ✅ API call
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchExpertsApi({
        q: searchQuery,
        availabilityType,
        topic,
        location,
        page: currentPage,
        pageSize: 8,
      });

      setPendingExperts(data.results || []);
      setTotalPages(data.pagination?.totalPages || []);

      setTimeout(() => {
        setCurrentExperts(data.results || []);
        setAllAvailabilityTypes(data.filters?.allAvailabilityType || []);
        setAllTopics(data.filters?.allTopics || []);
        setAllLocations(data.filters?.allLocations || []);
        setPendingExperts(null);
        setLoading(false);
        setNoData(data.results && data.results.length == 0);
      }, 100);
    } catch (err: any) {
      console.error("❌ Error fetching sessions:", err);
      setError("Failed to load sessions. Please try again later.");
      setLoading(false);
    }
  };
  // ✅ Scroll to top of component when page changes
  useEffect(() => {
    if (isFirstRun) {
      // Skip scroll on first load
      setIsFirstRun(false);
      return;
    }
    const section = document.querySelector("[data-expert-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);
  // ✅ Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [availabilityType, topic, location]);

  // ✅ Fetch when filters, searchTrigger, or page changes
  useEffect(() => {
    fetchExperts();
  }, [availabilityType, topic, location, currentPage, searchTrigger]);

  // ✅ Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ Search button handler (calls API immediately)
  const handleSearchClick = async () => {
    setCurrentPage(1);
    setSearchTrigger((prev) => prev + 1); // keep this for consistency
    try {
      setLoading(true);
      setError(null);

      const data = await fetchExpertsApi({
        q: searchQuery,
        availabilityType,
        topic,
        location,
        page: currentPage,
        pageSize: 8,
      });

      setPendingExperts(data.results || []);
      setTotalPages(data.pagination?.totalPages || []);

      setTimeout(() => {
        setCurrentExperts(data.results || []);
        setPendingExperts(null);
        setLoading(false);
      }, 100);
    } catch (err: any) {
      console.error("❌ Error fetching sessions (search):", err);
      setError("Failed to load sessions. Please try again later.");
      setLoading(false);
    }
  };

  const displayedExperts = pendingExperts || currentExperts;

  const router = useRouter();
  const handleResourceClick = (path: string) => {
    router.push(`${path}`);
  };
  // ✅ Inline Filter UI
  const clearAllFilters = () => {
    setSearchQuery("");
    setAvailabilityType("");
    setTopic("");
    setLocation("");
    setSearchTrigger((prev) => prev + 1);
  };
  const hasActiveFilters = searchQuery || availabilityType || topic || location;

  return (
    <section className="bg-dark-blue-gradient w-full px-[15px] md:px-[80px] py-10 md:py-20">
      <div className="max-w-6xl mx-auto pb-6 md:pb-10">
        <h2 className="heading-2 text-center md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {headline}
        </h2>
        {description?.markup && (
          <div
            className="
      text-white text-center body-text-large leading-relaxed
      [&_ul]:list-disc [&_ul]:pl-6
      [&_li]:mb-2
      [&_p]:mb-3
      [&_*]:text-white
    "
          >
            <RichText html={cleanRichText(description.markup)} />
          </div>
        )}
      </div>
      <div
        data-expert-section
        className="max-w-7xl mx-auto px-0 sm:px-0 md:px-0 lg:px-0 mb-10"
      >
        {/* ✅ Inline Filters */}
        <div className="flex flex-col gap-4 md:gap-7.5">
          <div className="relative h-[57px] w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="bg-white text-gray-800 placeholder-[var(--blue-color)] focus:outline-none w-full h-full"
              style={{
                paddingTop: "5px",
                paddingRight: "52px",
                paddingBottom: "5px",
                paddingLeft: "20px",
                border: "1px solid #000",
                borderRadius: "60px",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="text-blue absolute font-bold whitespace-nowrap flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{
                right: "5px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "42px",
                height: "42px",
                borderRadius: "100px",
                background: "linear-gradient(90deg, #F97C1A 0%, #FCB447 100%)",
                border: "none",
              }}
            >
              <FiSearch className="text-dark-blue" size={18} />
            </button>
          </div>
          {/* Filter Dropdowns Row */}
          <div className="flex flex-col gap-4 w-full">
            {/* Content Type Dropdown */}
            <div className="flex flex-row gap-4 md:gap-7.5 items-start justify-start flex-wrap">
              <Dropdown
                value={topic}
                onChange={setTopic}
                placeholder="Filter by Area of Expertise"
                options={
                  (allTopics || []).map((opt: TagItem) => ({
                    value: opt.text.toLowerCase(),
                    label: opt.text,
                  })) || []
                }
              />
              <Dropdown
                value={availabilityType}
                onChange={setAvailabilityType}
                placeholder="Filter by Availability"
                options={
                  (allAvailabilityTypes || []).map((opt: any) => ({
                    value: opt,
                    label: opt,
                  })) || []
                }
              />
              <Dropdown
                value={location}
                onChange={setLocation}
                placeholder="Filter by Location"
                options={
                  (allLocations || []).map((opt: TagItem) => ({
                    value: opt.text,
                    label: opt.text,
                  })) || []
                }
              />
            </div>
            {hasActiveFilters && (
              <div
                className="pr-[220px] md:pr-[25px] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={clearAllFilters}
              >
                <FiX className="text-light-orange text-[21px]" />
                <span className="body-text-small text-white text-left">
                  Clear all Filters
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ✅ Sessions list, error, pagination remain unchanged */}
      {error && <div className="text-red-400 text-center mt-10">{error}</div>}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 md:px-0 lg:px-0 relative min-h-[300px]">
        {/* Experts Grid */}

        {/* Glass Mask + Loader */}
        {loading && <Loader />}
        {!error && displayedExperts.length > 0 && (
          <div className="grid grid-cols-1 rounded-2xl sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7.5 mb-10">
            {displayedExperts.map((expert) => {
              return <ExpertCard key={expert.id} expert={expert} />;
            })}
          </div>
        )}
        {/* {loading && <Loader className="w-10 h-100 text-white" />} */}
        {noData && <NoExpertsFound clearAllFilters={clearAllFilters} />}
      </div>
      {!error && displayedExperts.length > 0 && (
        <div className="w-full flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages.length}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default IndependentExpertsSection;
