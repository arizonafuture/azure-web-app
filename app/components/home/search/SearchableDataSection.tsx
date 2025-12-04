"use client";
import { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

import {
  fetchExpertsApi,
  fetchResourcesApi,
  fetchUpcomingSessionsApi,
} from "@/app/service/search/search";

import Pagination from "../../common/Pagination";
import InputWithButton from "../../common/InputWithButton";
import Button from "../../common/Button";
import Domo from "./Domo";

import RegisterOrLoginExpert from "./RegisterOrLoginExpert";
import ExpertsSection from "./ExpertsSection";
import InformationalSessions from "./InformationalSessions";
import ResourceCard from "../../resources/ResourceCard";
import { TagItem } from "@/app/types/tagItem";
import { ExpertsSearchResponse } from "@/app/types/expert/ExpertsSearchResponse";
import { SessionItem } from "@/app/types/info-detail/UpcomingSessionsProps";
import { ContentRendererProps } from "@/app/types";
import { SearchableDataSectionProps } from "@/app/types/home/SearchableDataSectionProps";
import RegisterOrLoginSession from "./RegisterOrLoginSession";
import NoDataFound from "./NoDataFound";
import Loader from "../../common/Loader";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { useSearchParams } from "next/navigation";

const CLIENT_RESOURCES_PAGE_SIZE = 6;

const SearchableDataSection: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  const { properties } = content;
  const {
    mainDescription,
    mainHeadline,
    domoUrl,
    domoHeadline,
    expertCta,
    expertDescription,
    expertHeadline,
    resourceCta,
    resourceHeadline,
    sessionCta,
    sessionHeadline,
    backgroundImage,
  } = properties as SearchableDataSectionProps;

  const [loggedIn, setloggedIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    fetch("/api/set-cookie", { cache: "no-store" })
      .then((res) => res.json())
      .then(({ token }) => {
        if (token) {
          setloggedIn(true);
        }
      });
  }, []);

  const [globalSearchValue, setGlobalSearchValue] = useState("");

  const [topicFilter, setTopicFilter] = useState<string[]>([]);

  const [resources, setResources] = useState<any[]>([]);
  const [resourcesPending, setResourcesPending] = useState<any[] | null>(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  const [resourceTypeFilter, setResourceTypeFilter] = useState<string[]>([]);
  const [resourcesPage, setResourcesPage] = useState(1);
  const [resourcesTotalPages, setResourcesTotalPages] = useState<number[]>([]);
  const [allResourceTypes, setAllResourceTypes] = useState<TagItem[]>([]);
  const [allTopics, setAllTopics] = useState<TagItem[]>([]);

  const [experts, setExperts] = useState<ExpertsSearchResponse[]>([]);
  const [expertsPending, setExpertsPending] = useState<
    ExpertsSearchResponse[] | null
  >(null);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [expertsError, setExpertsError] = useState<string | null>(null);

  const [expertsPage, setExpertsPage] = useState(1);
  const [expertsTotalPages, setExpertsTotalPages] = useState<number[]>([]);

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsPending, setSessionsPending] = useState<SessionItem[] | null>(
    null
  );
  const [sessionsLoading, setSessionsLoading] = useState(true); // start true
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsTotalPages, setSessionsTotalPages] = useState<number[]>([]);
  const [allExpertCount, setAllExpertCount] = useState(0);
  const [allInformationSession, setAllInformationSession] = useState(0);
  const [isFirstRunResource, setIsFirstRunResource] = useState(true);
  const [isFirstRunSession, setIsFirstRunSession] = useState(true);
  const [isFirstRunExpert, setIsFirstRunExpert] = useState(true);
  const [noDataExperts, setNoDataExperts] = useState(false);
  const [noDataResource, setNoDataResource] = useState(false);
  const [noDataSession, setNoDataSession] = useState(false);
  const [scrollto, setScrollTo] = useState(searchParams.get("scrollto") || "");
  /* ------------------------------
      LOGIN STATE (local)
  ------------------------------- */

  const resourcesRequestIdRef = useRef(0);
  const expertsRequestIdRef = useRef(0);
  const sessionsRequestIdRef = useRef(0);

  useEffect(() => {
    setResourcesPage(1);
  }, [globalSearchValue, topicFilter, resourceTypeFilter]);

  useEffect(() => {
    setExpertsPage(1);
  }, [globalSearchValue, topicFilter]);

  useEffect(() => {
    setSessionsPage(1);
  }, [globalSearchValue, topicFilter]);

  const loadResources = async () => {
    const requestId = ++resourcesRequestIdRef.current;
    try {
      setResourcesLoading(true);
      setResourcesError(null);

      const topicParamForApi = topicFilter.length === 1 ? topicFilter[0] : "";

      const data = await fetchResourcesApi({
        q: globalSearchValue,
        resourceType: resourceTypeFilter.join(","),
        topic: topicParamForApi,
        page: 1,
        pageSize: 100,
      });

      if (requestId !== resourcesRequestIdRef.current) {
        return;
      }

      const rawResults = data.results || [];
      setResourcesPending(rawResults);
      setAllResourceTypes(data.filters?.allResourceType || []);
      setAllTopics(data.filters?.allTopics || []);

      const normalizedTopicFilter = topicFilter.map((t) =>
        t.trim().toLowerCase()
      );
      const normalizedTypeFilter = resourceTypeFilter.map((t) =>
        t.trim().toLowerCase()
      );

      const filteredResults = rawResults.filter((item: any) => {
        const itemTopics: string[] = Array.isArray(item.topic)
          ? item.topic
          : [];
        const itemResourceTypes: string[] = Array.isArray(item.resourceType)
          ? item.resourceType
          : [];

        const normalizedItemTopics = itemTopics.map((t) =>
          String(t).trim().toLowerCase()
        );
        const normalizedItemTypes = itemResourceTypes.map((t) =>
          String(t).trim().toLowerCase()
        );

        const matchesTopics =
          normalizedTopicFilter.length === 0 ||
          normalizedTopicFilter.every((t) => normalizedItemTopics.includes(t));

        const matchesTypes =
          normalizedTypeFilter.length === 0 ||
          normalizedItemTypes.some((t) => normalizedTypeFilter.includes(t));

        return matchesTopics && matchesTypes;
      });

      const totalPages = filteredResults.length
        ? Math.ceil(filteredResults.length / CLIENT_RESOURCES_PAGE_SIZE)
        : 0;

      const pagesArray =
        totalPages > 0
          ? Array.from({ length: totalPages }, (_, i) => i + 1)
          : [];

      setResourcesTotalPages(pagesArray);

      const startIndex = (resourcesPage - 1) * CLIENT_RESOURCES_PAGE_SIZE;
      const endIndex = startIndex + CLIENT_RESOURCES_PAGE_SIZE;

      const pagedResults = filteredResults.slice(startIndex, endIndex);

      setResources(pagedResults);
      setResourcesPending(null);
      setResourcesLoading(false);
      setAllExpertCount(data.allExpertCount);
      setAllInformationSession(data.allInformationSession);
      //setResources(data.results || []);
      setResourcesPending(null);
      setResourcesLoading(false);
      setNoDataResource(pagedResults && pagedResults.length === 0);
      setScrollTo("");
    } catch (err: any) {
      console.error("Error loading resources:", err);
      setResourcesError("Failed to load resources");
      setResourcesLoading(false);
    }
  };

  const loadExperts = async () => {
    if (!loggedIn) {
      setExperts([]);
      return;
    }

    const requestId = ++expertsRequestIdRef.current;

    try {
      setExpertsLoading(true);
      setExpertsError(null);

      const data = await fetchExpertsApi({
        q: globalSearchValue,
        topic: topicFilter.join(","),
        page: expertsPage,
        pageSize: 8,
      });

      if (requestId !== expertsRequestIdRef.current) {
        return;
      }

      setExpertsPending(data.results || []);
      setExpertsTotalPages(data.pagination?.totalPages || []);

      setExperts(data.results || []);
      setExpertsPending(null);
      setExpertsLoading(false);
      setNoDataExperts(data.results && data.results.length === 0);
      setScrollTo("");
    } catch (err: any) {
      console.error("Error loading experts:", err);

      setExperts([]);
      setExpertsPending(null);
      setExpertsLoading(false);

      setExpertsError("Please login to view experts.");
    }
  };

  const loadSessions = async () => {
    if (!loggedIn) {
      setSessions([]);
      return;
    }

    const requestId = ++sessionsRequestIdRef.current;

    try {
      setSessionsLoading(true);
      setSessionsError(null);

      const data = await fetchUpcomingSessionsApi({
        q: globalSearchValue,
        topic: topicFilter.join(","),
        isInitial: false,
        page: sessionsPage,
        pageSize: 6,
      });

      if (requestId !== sessionsRequestIdRef.current) {
        return;
      }

      setSessionsPending(data.results || []);
      setSessionsTotalPages(data.pagination?.totalPages || []);

      setSessions(data.results || []);
      setSessionsPending(null);
      setSessionsLoading(false);
      setNoDataSession(data.results && data.results.length === 0);
      setScrollTo("");
    } catch (err: any) {
      console.error("Error loading sessions:", err);

      setSessions([]);
      setSessionsPending(null);
      setSessionsLoading(false);

      setSessionsError("Please login to view sessions.");
    }
  };

  useEffect(() => {
    loadResources();
  }, [globalSearchValue, topicFilter, resourceTypeFilter, resourcesPage]);

  useEffect(() => {
    loadExperts();
  }, [globalSearchValue, topicFilter, expertsPage, loggedIn]);

  useEffect(() => {
    loadSessions();
  }, [globalSearchValue, topicFilter, sessionsPage, loggedIn]);

  // ✅ Always use FIRST CTA
  const cta = expertCta?.[0];

  // ✅ Dynamic URL (no static)
  const ctaHref = cta?.url || cta?.route?.path || "#";

  // ✅ Dynamic label
  const ctaLabel = cta?.title || "";
  useEffect(() => {
    if (scrollto && scrollto == "resource") {
      const section = document.querySelector("[data-resource-section]");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [scrollto, resources]);

  useEffect(() => {
    if (isFirstRunResource) {
      // Skip scroll on first load
      setIsFirstRunResource(false);
      return;
    }
    const section = document.querySelector("[data-resource-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resourcesPage]);

  useEffect(() => {
    if (isFirstRunExpert) {
      // Skip scroll on first load
      setIsFirstRunExpert(false);
      return;
    }
    const section = document.querySelector("[data-experts-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expertsPage]);

  useEffect(() => {
    if (isFirstRunSession) {
      // Skip scroll on first load
      setIsFirstRunSession(false);
      return;
    }
    const section = document.querySelector("[data-session-section]");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [sessionsPage]);
  /* ------------------------------
      UI
  ------------------------------- */
  const displayedResources = resourcesPending ?? resources;
  return (
    <section className="bg-dark-blue-gradient relative w-full pt-12 md:pt-16 lg:py-20 pb-[200px] md:pb-[250px] lg:pb-[270px] xl:pb-[300px] px-4 sm:px-6 lg:px-16 xl:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="mb-16 md:mb-20">
          <h2 className="heading-2 !font-bold text-white mb-4 md:mb-6 text-center">
            {mainHeadline}
          </h2>
          <p className="body-text text-white text-center mb-10 w-full mx-auto">
            {mainDescription}
          </p>

          {/* SEARCH BAR */}
          <div className="mb-8 w-full mx-auto">
            <InputWithButton
              type="text"
              value={globalSearchValue}
              onChange={(e) => setGlobalSearchValue(e.target.value)}
              placeholder="Enter a keyword or phrase"
              buttonText="Search All"
              leftIcon={<FiSearch />}
            />
          </div>

          <div className="mb-8">
            <p className="body-text-large !font-bold text-lighter-blue mb-4">
              Filter by Topics
            </p>
            <div className="flex flex-wrap justify-start gap-3">
              {allTopics?.map((topic) => {
                const isActive = topicFilter.includes(topic.text);
                return (
                  <button
                    key={topic.text}
                    onClick={() =>
                      setTopicFilter((prev) =>
                        prev.includes(topic.text)
                          ? prev.filter((t) => t !== topic.text)
                          : [...prev, topic.text]
                      )
                    }
                    className={`btn-light-blue ${
                      isActive
                        ? "ring-2 ring-offset-1 !bg-[var(--dark-blue-color)] text-white"
                        : ""
                    }`}
                  >
                    {topic.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-[30px] md:mb-10">
            <div className="h-px w-full bg-lighter-blue"></div>
          </div>

          {/* DOMO */}
          <Domo domoUrl={domoUrl} domoHeadline={domoHeadline} />

          <div data-experts-section className="mb-[30px] md:mb-10">
            <div className="h-px w-full bg-lighter-blue"></div>
          </div>

          {!loggedIn ? (
            <RegisterOrLoginExpert
              allExpertCount={allExpertCount}
              headline={expertHeadline}
              description={expertDescription}
            />
          ) : (
            <>
              <ExpertsSection
                allExperts={experts}
                noData={noDataExperts}
                headline={expertHeadline}
                description={expertDescription}
                expertCta={expertCta}
                expertsLoading={expertsLoading}
              />
              {experts && experts.length > 0 && (
                <Pagination
                  currentPage={expertsPage}
                  totalPages={expertsTotalPages.length}
                  onPageChange={setExpertsPage}
                  className="mb-[30px] md:mb-0"
                />
              )}
              {/* Mobile: Get in Touch button at bottom */}
              <div className="w-full md:hidden flex justify-center">
                {cta && (
                  <Button
                    variant="orange"
                    showArrow={true}
                    className="whitespace-nowrap !pl-[30px] !pr-[5px] !py-[5px]"
                    onClick={() => router.push(ctaHref)}
                  >
                    {ctaLabel}
                  </Button>
                )}
              </div>
            </>
          )}

          <div data-resource-section className="mb-[30px] md:mb-10 mt-10">
            <div className="h-px w-full bg-lighter-blue"></div>
          </div>

          <div className="mb-16 md:mb-20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h3 className="heading-3 text-white mb-6">
                  {resourceHeadline}
                </h3>
                <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center">
                  <span className="body-text-large !font-bold text-white">
                    Content Types:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {allResourceTypes.map((type) => {
                      const isActive = resourceTypeFilter.includes(type.text);
                      return (
                        <button
                          key={type.text}
                          onClick={() =>
                            setResourceTypeFilter((prev) =>
                              prev.includes(type.text)
                                ? prev.filter((t) => t !== type.text)
                                : [...prev, type.text]
                            )
                          }
                          className={`btn-light-blue ${
                            isActive
                              ? "ring-2 !bg-[var(--dark-blue-color)] text-white"
                              : ""
                          }`}
                        >
                          {type.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 hidden md:block items-start sm:items-center mt-15">
                <Button
                  variant="orange"
                  showArrow={true}
                  onClick={() => {
                    router.push("/resources");
                  }}
                  className="whitespace-nowrap !pl-[30px] !pr-[5px] !py-[5px]"
                >
                  Browse All
                </Button>
              </div>
            </div>
            <div className="relative min-h-[250px] mb-5">
              {resourcesLoading ? (
                <>
                  <Loader className="" />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {displayedResources &&
                    displayedResources.length > 0 &&
                    displayedResources.map((r: any) => (
                      <ResourceCard key={r.id} resource={r} />
                    ))}
                </div>
              )}
              {noDataResource && <NoDataFound />}
            </div>
            {displayedResources && displayedResources.length > 0 && (
              <Pagination
                currentPage={resourcesPage}
                totalPages={resourcesTotalPages.length}
                onPageChange={setResourcesPage}
                className="mb-[30px] md:mb-0"
              />
            )}

            {/* Mobile: Get in Touch button at bottom */}
            <div className="w-full md:hidden flex justify-center">
              <Button
                variant="orange"
                showArrow={true}
                onClick={() => {
                  router.push("/resources");
                }}
                className="whitespace-nowrap !pl-[30px] !pr-[5px] !py-[5px]"
              >
                Browse All
              </Button>
            </div>
          </div>

          <div data-session-section className="mb-[30px] md:mb-10">
            <div className="h-px w-full bg-lighter-blue"></div>
          </div>

          {!loggedIn ? (
            <RegisterOrLoginSession
              allInformationSession={allInformationSession}
              headline={sessionHeadline}
            />
          ) : (
            <>
              <InformationalSessions
                sessionsLoading={sessionsLoading}
                allSession={sessions}
                headline={sessionHeadline}
                sessionCta={sessionCta}
                noData={noDataSession}
              />
              {sessions && sessions.length > 0 && (
                <Pagination
                  currentPage={sessionsPage}
                  totalPages={sessionsTotalPages.length}
                  onPageChange={setSessionsPage}
                  className="mb-[30px] md:mb-0"
                />
              )}

              {/* Mobile: Get in Touch button at bottom */}
              <div className="w-full md:hidden flex justify-center">
                {cta && (
                  <Button
                    variant="orange"
                    showArrow={true}
                    className="whitespace-nowrap"
                    onClick={() => router.push(ctaHref)}
                  >
                    {ctaLabel}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <div
          className="absolute left-0 right-0 bottom-0 top-[98%] md:top-[95%] lg:top-[90%] z-0 pointer-events-none min-h-[300px]"
          style={{
            background: `url(${buildMediaUrl(
              (backgroundImage && backgroundImage[0]?.url) || ""
            )}) center top / cover no-repeat`,
            height: "auto",
            width: "100%",
            filter: "grayscale(100%)",
          }}
        ></div>
      </div>
    </section>
  );
};

export default SearchableDataSection;
