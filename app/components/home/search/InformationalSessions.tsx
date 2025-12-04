"use client";

import { SessionItem } from "@/app/types/info-detail/UpcomingSessionsProps";
import Button from "../../common/Button";
import SessionCard from "../../info-session/SessionCard";
import { useRouter } from "next/navigation";
import NoDataFound from "./NoDataFound";
import Loader from "../../common/Loader";

interface ExpertSectionProps {
  allSession: SessionItem[];
  headline?: string;
  sessionCta?: any[];
  sessionsLoading: boolean;
  noData: boolean;
}

const InformationalSessions: React.FC<ExpertSectionProps> = ({
  allSession,
  headline,
  sessionCta,
  sessionsLoading,
  noData,
}) => {
  const router = useRouter();

  // ✅ Always use FIRST CTA object from array
  const cta = sessionCta?.[0];

  // ✅ Correct CTA URL resolution (no static!)
  const ctaHref = cta?.url || cta?.route?.path || "#"; // fallback only if absolutely nothing

  // ✅ Correct CTA label
  const ctaLabel = cta?.title || cta?.name || "Browse All";

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-10 gap-4">
        <h2 className="heading-3 md:text-4xl lg:text-5xl font-semibold text-white">
          {headline}
        </h2>

        <div className="hidden md:block">
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
      </div>
      {/* Event Cards Grid */}
      <div className="relative min-h-[300px]">
        {sessionsLoading && <Loader />}
        {allSession && allSession.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-4 md:mb-10 items-stretch">
            {allSession.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
        {noData && <NoDataFound />}
      </div>
    </>
  );
};

export default InformationalSessions;
