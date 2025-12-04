"use client";

import { useRouter } from "next/navigation";
import Button from "../../common/Button";
import ExpertCard from "../../experts/ExpertCard";
import { ExpertsSearchResponse } from "@/app/types/expert/ExpertsSearchResponse";
import { LinkItem } from "@/app/types";
import NoDataFound from "./NoDataFound";
import Loader from "../../common/Loader";

interface ExpertSectionProps {
  allExperts: ExpertsSearchResponse[];
  headline?: string;
  isMobile?: boolean;
  description?: string;
  expertCta?: LinkItem[]; // ARRAY
  expertsLoading: boolean;
  noData: boolean;
}

const ExpertsSection: React.FC<ExpertSectionProps> = ({
  allExperts,
  headline,
  isMobile,
  description,
  expertCta,
  expertsLoading,
  noData,
}) => {
  const router = useRouter();
  // ✅ Always use FIRST CTA
  const cta = expertCta?.[0];

  // ✅ Dynamic URL (no static)
  const ctaHref = cta?.url || cta?.route?.path || "#";

  // ✅ Dynamic label
  const ctaLabel = cta?.title || "";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-10">
        <div className="mb-6 md:mb-0 md:flex-1">
          <h3 className="heading-3 text-white mb-2">{headline}</h3>
          <p className="body-text-small text-white leading-relaxed !leading-[1.5]">
            {description}
          </p>
        </div>

        <div className="md:ml-6 hidden md:block">
          {/* CTA BUTTON - dynamic from Umbraco */}
          {cta && (
            <Button
              variant="orange"
              showArrow={true}
              className="whitespace-nowrap mt-10 md:mt-18 !pl-[30px] !pr-[5px] !py-[5px]"
              onClick={() => router.push(ctaHref)}
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
      {/* Expert Cards Grid */}
      <div className="relative min-h-[300px]">
        {expertsLoading && <Loader />}
        {allExperts && allExperts.length > 0 && (
          <div className="grid grid-cols-1 rounded-2xl sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-4 md:mb-10">
            {allExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} isMobile={true} />
            ))}
          </div>
        )}
        {noData && <NoDataFound />}
      </div>
    </>
  );
};

export default ExpertsSection;
