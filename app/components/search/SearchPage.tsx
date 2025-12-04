"use client";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/app/components/common/Pagination";
import { fetchSiteSearch } from "@/app/service/search/siteSearch";
import { truncateText } from "@/app/utils/truncateText";
import Loader from "@/app/components/common/Loader";
import Link from "next/link";

type Tab = "general" | "experts" | "sessions";

export default function SearchPage({ initialQuery, initialTab }: { initialQuery: string; initialTab: Tab }) {
  const [q, setQ] = useState(initialQuery);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [pageGeneral, setPageGeneral] = useState(1);
  const [pageExperts, setPageExperts] = useState(1);
  const [pageSessions, setPageSessions] = useState(1);
  const pageSize = 10;

  const [generalResults, setGeneralResults] = useState<any[]>([]);
  const [generalTotalPages, setGeneralTotalPages] = useState(0);
  const [expertsResults, setExpertsResults] = useState<any[]>([]);
  const [expertsTotalPages, setExpertsTotalPages] = useState(0);
  const [sessionsResults, setSessionsResults] = useState<any[]>([]);
  const [sessionsTotalPages, setSessionsTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const term = q.trim();
      if (!term) {
        setGeneralResults([]);
        setGeneralTotalPages(0);
        setExpertsResults([]);
        setExpertsTotalPages(0);
        setSessionsResults([]);
        setSessionsTotalPages(0);
        setLoading(false);
        return;
      }
      try {
        const [g, e, s] = await Promise.all([
          fetchSiteSearch({ searchTerm: term, searchType: "general", pageNumber: pageGeneral, pageSize }),
          fetchSiteSearch({ searchTerm: term, searchType: "experts", pageNumber: pageExperts, pageSize }),
          fetchSiteSearch({ searchTerm: term, searchType: "sessions", pageNumber: pageSessions, pageSize }),
        ]);
        setGeneralResults(g.results || []);
        setGeneralTotalPages(Math.ceil((g.totalCount || 0) / pageSize));
        setExpertsResults(e.results || []);
        setExpertsTotalPages(Math.ceil((e.totalCount || 0) / pageSize));
        setSessionsResults(s.results || []);
        setSessionsTotalPages(Math.ceil((s.totalCount || 0) / pageSize));
      } catch (_err) {
        setGeneralResults([]);
        setGeneralTotalPages(0);
        setExpertsResults([]);
        setExpertsTotalPages(0);
        setSessionsResults([]);
        setSessionsTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q, pageGeneral, pageExperts, pageSessions]);

  const activeResults = useMemo(() => {
    if (tab === "general") return { results: generalResults, totalPages: generalTotalPages, page: pageGeneral, setPage: setPageGeneral };
    if (tab === "experts") return { results: expertsResults, totalPages: expertsTotalPages, page: pageExperts, setPage: setPageExperts };
    return { results: sessionsResults, totalPages: sessionsTotalPages, page: pageSessions, setPage: setPageSessions };
  }, [tab, generalResults, expertsResults, sessionsResults, generalTotalPages, expertsTotalPages, sessionsTotalPages, pageGeneral, pageExperts, pageSessions]);

  return (
    <main className="px-6 md:px-10 lg:px-16 py-10">
      <h1 className="heading-2 text-blue text-center mb-6">Search Result</h1>
      <div className="max-w-3xl mx-auto flex gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPageGeneral(1);
              setPageExperts(1);
              setPageSessions(1);
            }
          }}
          placeholder="Search"
          className="input-field input-field-normal flex-1"
        />
        <button className="btn btn-orange" onClick={() => { setPageGeneral(1); setPageExperts(1); setPageSessions(1); }}>Search All</button>
      </div>
      <div className="max-w-3xl mx-auto flex gap-3 mb-4">
        <button className={`btn-light-blue ${tab === "general" ? "!bg-[var(--dark-blue-color)] text-white" : ""}`} onClick={() => setTab("general")}>General Website Pages</button>
        <button className={`btn-light-blue ${tab === "experts" ? "!bg-[var(--dark-blue-color)] text-white" : ""}`} onClick={() => setTab("experts")}>Subject Matter Experts</button>
        <button className={`btn-light-blue ${tab === "sessions" ? "!bg-[var(--dark-blue-color)] text-white" : ""}`} onClick={() => setTab("sessions")}>Informational Sessions</button>
      </div>
      {loading ? (
        <Loader className="my-10" />
      ) : (
        <div className="max-w-3xl mx-auto">
          {activeResults.results.map((item, idx) => (
            <div key={idx} className="py-4 border-b border-gray-200">
              <Link href={item.url} className="heading-5 text-blue hover:underline">{item.title}</Link>
              <p className="body-text text-dark-blue mt-2">{truncateText(String(item.content || ""), 180)}</p>
            </div>
          ))}
          {activeResults.results.length === 0 && (
            <p className="text-center body-text text-dark-blue mt-10">No results found.</p>
          )}
          {activeResults.totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={activeResults.page} totalPages={activeResults.totalPages} onPageChange={activeResults.setPage} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
