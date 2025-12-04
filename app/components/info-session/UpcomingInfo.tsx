"use client";
import { useState, useEffect } from "react";
import Button from "../common/Button";
import Pagination from "../common/Pagination";
import Dropdown from "../common/Dropdown";
import DateField from "../common/DateField";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { fetchUpcomingSessionsApi } from "@/app/service/search/search";
import { TagItem } from "@/app/types/tagItem";
import SessionCard from "./SessionCard";
import { SessionItem } from "@/app/types/info-detail/UpcomingSessionsProps";
import UpcommingSessionCard from "./UpcommingSessionCard";
import ProtectedFallback from "../common/ProtectedFallback";
import { useSearchParams } from "next/navigation";
import NoSessionFound from "./NoSessionFound";
import Loader from "../common/Loader";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// ✅ Match your real Umbraco content structure
interface UpcomingInfoContent {
  contentType: string;
  id: string;
  properties: {
    headline: string;
    searchIcon?: string;
    sessionFormatOptions?: string[];
    viewPastSessionsCta?: {
      title?: string;
      url?: string;
      target?: string | null;
    }[];
  };
}

const UpcomingInfo: React.FC<{ content: UpcomingInfoContent }> = ({
  content,
}) => {
  const getCurrentMonth = () =>
    new Date().toLocaleString("en-US", { month: "long" });
  const searchParams = useSearchParams();
  const queryTopic = searchParams.get("topic") || "";
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [pendingSessions, setPendingSessions] = useState<SessionItem[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFormat, setSessionFormat] = useState("");
  const [topic, setTopic] = useState(queryTopic || "");
  const [month, setMonth] = useState("");
  const [isInitial, setIsInitial] = useState(true);
  const [allSessionFormat, setAllSessionFormat] = useState<TagItem[]>([]);
  const [alltopic, setAllTopic] = useState<TagItem[]>([]);
  const [userId, setUserId] = useState<string>("");

  const [isFirstRun, setIsFirstRun] = useState(true);
  // For search button click
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [noData, setNoData] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function loadUserId() {
      try {
        const res = await fetch("/api/set-cookie", { cache: "no-store" });
        const { token } = await res.json();

        if (token) {
          const decoded: any = jwtDecode(token);
          const id =
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];
          console.log("id", id);
          setUserId(id);
        }
      } catch (err) {
        console.error("Failed to load JWT:", err);
      }
    }

    loadUserId();
  }, []);

  // ✅ API call
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      if (topic) {
        setIsInitial(false);
      }
      console.log("userid", userId);
      const data = await fetchUpcomingSessionsApi({
        q: searchQuery,
        sessionFormat,
        topic,
        month,
        isInitial: isInitial,
        page: currentPage,
        pageSize: 6,
        userId,
      });
      if (data?.status === 401) {
        setUnauthorized(true);
        return;
      }
      setIsInitial(false);
      setPendingSessions(data.results || []);
      setTotalPages(data.pagination?.totalPages || []);
      setAllTopic(data.filters?.allTopics);
      setAllSessionFormat(data.filters?.allSessionFormat);
      setTimeout(() => {
        setSessions(data.results || []);
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
  }, [sessionFormat, topic, month]);

  // ✅ Fetch when filters, searchTrigger, or page changes
  useEffect(() => {
    if (!userId) return; // ⛔ Prevent first call

    fetchSessions();
  }, [sessionFormat, topic, month, currentPage, searchTrigger, userId]);

  // ✅ Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    if (isFirstRun) {
      // Skip scroll on first load
      setIsFirstRun(false);
      return;
    }
    const section = document.querySelector("[data-session-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);
  // ✅ Search button handler (calls API immediately)
  const handleSearchClick = async () => {
    setLoading(true);
    setCurrentPage(1);
    setSearchTrigger((prev) => prev + 1); // keep this for consistency

    try {
      setError(null);

      const data = await fetchUpcomingSessionsApi({
        q: searchQuery,
        sessionFormat,
        topic,
        month,
        isInitial,
        page: currentPage,
        pageSize: 6,
        userId,
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

  // ✅ Month name conversion
  const handleMonthChange = (value: string) => {
    if (value && !isNaN(Date.parse(value))) {
      const monthName = new Date(value).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      setMonth(monthName);
    } else {
      setMonth(value);
    }
  };

  const displayedSessions = pendingSessions || sessions;

  // ✅ extract button CTA
  const viewPastCta = content?.properties.viewPastSessionsCta?.[0];
  const viewPastUrl = viewPastCta?.url || "#";
  const viewPastLabel = viewPastCta?.title || "View Past Info Sessions";

  // ✅ Inline Filter UI
  const clearAllFilters = () => {
    setSearchQuery("");
    setSessionFormat("");
    setTopic("");
    setMonth("");
    setIsInitial(true);
  };

  const hasActiveFilters = searchQuery || sessionFormat || topic || month;
  if (unauthorized) {
    return <ProtectedFallback />;
  }
  return (
    <div
      data-session-section
      className="bg-dark-blue px-[15px] md:px-[70px] md:py-20 py-10 flex flex-col gap-10 items-center justify-center self-stretch shrink-0 relative overflow-hidden"
    >
      <div className="w-full max-w-[1440px] flex flex-col md:gap-10">
        {/* ✅ Dynamic Title from Umbraco */}
        {/* <div className="flex flex-col items-center justify-start">
          <h2 className="heading-2 text-white text-center">
            {content?.properties.headline}
          </h2>
        </div> */}

        {/* ✅ Inline Filters */}
        <div className="flex flex-col gap-4 md:gap-7.5 items-start justify-start self-stretch shrink-0 relative z-20">
          <div className="flex flex-row gap-4 md:gap-7.5 items-start justify-start self-stretch shrink-0 relative flex-wrap">
            <Dropdown
              value={sessionFormat}
              onChange={setSessionFormat}
              placeholder="Select Session Format"
              options={
                (allSessionFormat || []).map((opt) => ({
                  value: opt.text.toLowerCase(),
                  label: opt.text,
                })) || []
              }
            />

            <Dropdown
              value={topic}
              onChange={setTopic}
              placeholder="Select Topic"
              options={
                (alltopic || []).map((opt) => ({
                  value: opt.text.toLowerCase(),
                  label: opt.text,
                })) || []
              }
            />

            <DateField
              type="month"
              placeholder="Filter by Month"
              value={month}
              onChange={handleMonthChange}
            />
          </div>

          {/* ✅ Inline Search Field */}
          <div className="flex flex-col gap-4 md:gap-[14px] items-start justify-start self-stretch shrink-0 relative">
            <div className="relative h-[57px] w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="bg-white text-gray-800 placeholder:text-blue placeholder:body-text focus:outline-none w-full h-full"
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
                  background:
                    "linear-gradient(90deg, #F97C1A 0%, #FCB447 100%)",
                  border: "none",
                }}
              >
                <FiSearch className="text-dark-blue" size={18} />
              </button>
            </div>

            {hasActiveFilters && (
              <div
                className="pr-[220px] md:pr-[25px] flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={clearAllFilters}
              >
                <FiX className="text-light-orange text-[21px]" />
                <span className="body-text-small text-white text-left text-sm">
                  Clear all Filters
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Sessions list, error, pagination remain unchanged */}
        {error && <div className="text-red-400 text-center mt-10">{error}</div>}
        <div className="relative min-h-[300px]">
          {loading && <Loader />}
          {!error && displayedSessions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch mt-10 md:mt-0 gap-4 md:gap-7.5 items-center justify-center content-start self-stretch shrink-0 relative md:mb-0 mb-10">
              {displayedSessions.map((session) => {
                return (
                  <UpcommingSessionCard key={session.id} session={session} />
                );
              })}
            </div>
          )}
          {noData && <NoSessionFound clearAllFilters={clearAllFilters} />}
        </div>
        <div className="flex flex-row items-start justify-between self-stretch shrink-0 relative flex-wrap gap-6">
          {!error && displayedSessions.length > 0 && (
            <>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages.length}
                onPageChange={handlePageChange}
                className="shrink-0"
              />
              <a onClick={() => router.push(`/?scrollto=resource`)}>
                <Button variant="orange" showArrow={true} className="!shrink-0">
                  {viewPastLabel}
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingInfo;
