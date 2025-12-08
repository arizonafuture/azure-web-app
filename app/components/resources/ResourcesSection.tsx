"use client";
import { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Dropdown from "../common/Dropdown";
import {
  FiArrowRight,
  FiCalendar,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FaNewspaper, FaRegFile, FaRegPlayCircle } from "react-icons/fa";
import { FaS, FaTextSlash, FaVolumeHigh } from "react-icons/fa6";
import { API_BASE_URL, ResourceApiUrl } from "@/app/config/umbraco";
import { useRouter } from "next/navigation";
import { truncateText } from "@/app/utils/truncateText";
import { fetchResourcesApi } from "@/app/service/search/search";
import ResourceCard from "./ResourceCard";
import { TagItem } from "@/app/types/tagItem";
import Loader from "../common/Loader";
import NoResourceFound from "./NoResourceFound";

// ✅ Match your real Umbraco content structure
interface ResourceSectionProps {
  contentType: string;
  id: string;
  properties: {
    resourceType?: string[];
    topic?: string[];
  };
}

const ResourceSection: React.FC<{ content: ResourceSectionProps }> = ({
  content,
}) => {
  const [sessions, setSessions] = useState<Resource[]>([]);
  const [pendingSessions, setPendingSessions] = useState<Resource[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("");
  const [topic, setTopic] = useState("");
  const [allTopic, setAllTopics] = useState<TagItem[]>([]);
  const [allResourceType, setAllResourceType] = useState<TagItem[]>([]);

  // For search button click
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [noData, setNoData] = useState(false);
  // ✅ API call
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchResourcesApi({
        q: searchQuery,
        resourceType: contentType,
        topic,
        page: currentPage,
        pageSize: 6,
      });

      setPendingSessions(data.results || []);
      setTotalPages(data.pagination?.totalPages || []);

      setTimeout(() => {
        setSessions(data.results || []);
        setAllTopics(data.filters.allTopics || "");
        setAllResourceType(data.filters.allResourceType || "");
        setPendingSessions(null);
        setLoading(false);
        setNoData(data.results && data.results.length === 0);
      }, 100);
    } catch (err: any) {
      console.error("❌ Error fetching sessions:", err);
      setError("Failed to load sessions. Please try again later.");
      setLoading(false);
    }
  };

  // ✅ Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [contentType, topic]);

  // ✅ Fetch when filters, searchTrigger, or page changes
  useEffect(() => {
    fetchSessions();
  }, [contentType, topic, currentPage, searchTrigger]);

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

      const data = await fetchResourcesApi({
        q: searchQuery,
        resourceType: contentType,
        topic,
        page: 1,
        pageSize: 6,
      });
      setPendingSessions(data.results || []);
      setTotalPages(data.pagination?.totalPages || []);

      setTimeout(() => {
        setSessions(data.results || []);
        setPendingSessions(null);
        setLoading(false);
        setNoData(data.results && data.results.length === 0);
      }, 100);
    } catch (err: any) {
      console.error("❌ Error fetching sessions (search):", err);
      setError("Failed to load sessions. Please try again later.");
      setLoading(false);
    }
  };

  const displayedSessions = pendingSessions || sessions;
  // ✅ Inline Filter UI
  const clearAllFilters = () => {
    setSearchQuery("");
    setContentType("");
    setTopic("");
    setSearchTrigger((prev) => prev + 1);
  };
  const hasActiveFilters = searchQuery || contentType || topic;
  useEffect(() => {
    if (isFirstRun) {
      // Skip scroll on first load
      setIsFirstRun(false);
      return;
    }
    const section = document.querySelector("[data-resource-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);
  return (
    <div
      data-resource-section
      className="bg-dark-blue-gradient relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 xl:px-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* ✅ Inline Filters */}
        <div className="flex flex-col gap-4 md:gap-[30px] items-start justify-start self-stretch shrink-0 relative z-20">
          {/* Filter Dropdowns Row */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-[30px] items-stretch md:items-start justify-start self-stretch shrink-0 relative w-full">
            {/* Content Type Dropdown */}
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <Dropdown
                value={contentType}
                onChange={setContentType}
                placeholder="Filter by Content Type"
                options={
                  allResourceType.map((opt) => ({
                    value: opt.text.toLowerCase(),
                    label: opt.text,
                  })) || []
                }
              />
            </div>

            {/* Topic Dropdown */}
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <Dropdown
                value={topic}
                onChange={setTopic}
                placeholder="Filter by Topics"
                options={
                  (allTopic || []).map((opt: TagItem) => ({
                    value: opt.text.toLowerCase(),
                    label: opt.text,
                  })) || []
                }
              />
            </div>

            {/* ✅ Inline Search Field */}
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <div className="relative h-[50px] w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="bg-white text-gray-800 placeholder-[#6A6E8C] focus:outline-none w-full h-full"
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
                  className="text-dark-blue absolute font-bold whitespace-nowrap flex items-center justify-center hover:opacity-90 transition-opacity"
                  style={{
                    right: "5px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "42px",
                    height: "42px",
                    borderRadius: "100px",
                    background:
                      "linear-gradient(90deg, #F97C1A 0%, #FCB447 100%)",
                    border: "none",
                  }}
                >
                  <FiSearch className="text-dark-blue" size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative w-full">
            {hasActiveFilters && (
              <div
                className="pr-0 md:pr-[25px] flex flex-row gap-2 items-center justify-center md:justify-center shrink-0 self-start md:self-end cursor-pointer hover:opacity-80 transition-opacity mt-2"
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

        {/* ✅ Sessions list, error, pagination remain unchanged */}
        {error && <div className="text-red-400 text-center mt-10">{error}</div>}
        <div className="relative min-h-[100px]">
          {loading && <Loader className="mb-3" />}
          {!error && displayedSessions.length > 0 && (
            <div
              data-resource-section
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {displayedSessions.map((resource) => {
                return <ResourceCard key={resource.id} resource={resource} />;
              })}
            </div>
          )}
          {noData && <NoResourceFound clearAllFilters={clearAllFilters} />}
        </div>
        <div className="w-full flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceSection;
