import { MediaItem, Settings } from "@/app/types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { getSettingsClass } from "@/app/utils/settings";

interface PageHeaderProps {
  backgroundImage?: string;
  title: string | string[];
  subtext?: string;
  className?: string;
}
interface SubPageBanner {
  content: {
    properties: {
      headline?: string;
      subheadline?: string;
      backgroundImages?: MediaItem[];
    };
  };
  settings: Settings;
}
const PageHeader: React.FC<SubPageBanner> = ({ content, settings }) => {
  const {
    headline,
    subheadline,
    backgroundImages = [],
  } = content?.properties || {};
  // Handle title as string or array
  const backgroundImage = backgroundImages.length
    ? backgroundImages[0].url
    : "";
  const settingsClass = getSettingsClass(settings);
  return (
    <div
      className={
        "pt-20 pb-20 px-4 sm:px-8 md:px-16 lg:px-[135px] flex flex-col gap-2.5 items-center justify-end self-stretch shrink-0 min-h-[450px] relative bg-cover bg-center bg-no-repeat overflow-hidden" +
        (settingsClass || "")
      }
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(24, 37, 78, 0.00) 0%,rgba(24, 37, 78, 0.90) 100%), url(${buildMediaUrl(
          backgroundImage
        )})`
      }}
    >
      <div className="flex flex-col gap-[34px] items-center justify-start shrink-0 w-full max-w-5xl relative z-10">
        <div className="flex flex-col gap-4 items-center justify-start self-stretch shrink-0 relative">
          {/* Main Title */}
          <h1 className="heading-1 text-white text-center">{headline}</h1>

          {/* Subtitle/Subtext */}
          {subheadline && (
            <p className="text-lighter-blue text-center subhead sm:text-lg md:text-xl lg:text-2xl leading-relaxed relative self-stretch">
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;