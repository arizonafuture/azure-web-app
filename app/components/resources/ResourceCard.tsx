import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaNewspaper, FaRegFile, FaRegPlayCircle } from "react-icons/fa";
import { FaTextSlash, FaVolumeHigh } from "react-icons/fa6";
import { truncateText } from "@/app/utils/truncateText";
const ResourceCard = ({ resource }: { resource: Resource }) => {
  const router = useRouter();

  // 🟦 Ensure safe data
  const type = resource.resourceType?.[0]?.toLowerCase() || "";

  // 🟧 Correct Icon Selection
  const IconComponent =
    type === "video"
      ? FaRegPlayCircle
      : type === "audio"
      ? FaVolumeHigh
      : type === "report"
      ? FaRegFile
      : type === "text"
      ? FaNewspaper
      : FaTextSlash;

  // 🟩 CTA text based on type
  const ctaText =
    type === "video"
      ? "Watch"
      : type === "audio"
      ? "Listen"
      : type === "report"
      ? "Read"
      : "Read";

  return (
    <div
      key={resource.id}
      className="bg-transparent rounded-[20px] p-4 flex flex-col"
    >
      <div className="gap-4 mb-2">
        <IconComponent className="text-3xl text-light-blue mb-2.5" />
        <h6 className="heading-6 text-white">{resource.headline}</h6>

        <span className="text-xs font-bold text-light-blue uppercase block">
          {Array.isArray(resource.resourceType)
            ? resource.resourceType.join(", ")
            : resource.resourceType || ""}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-white text-sm">
          <FiUser className="text-base text-light-orange" />
          <span>
            {Array.isArray(resource.authors)
              ? resource.authors.join(", ")
              : resource.authors || ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <FiCalendar className="text-base text-light-orange" />
          <span>
            {resource.date
              ? new Date(resource.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "No date"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-2">
        {truncateText(resource.description, 100)}
      </p>
      {/* CTA Button */}
      <button
        onClick={() => router.push(resource.pageUrl)}
        className="text-link shrink-0 text-light-orange !font-bold flex items-center justify-start gap-2 mt-auto"
      >
        {ctaText}
        <span className="text-link-icon bg-light-orange text-blue">
          <FiArrowRight />
        </span>
      </button>
    </div>
  );
};

export default ResourceCard;
