"use client";
import { useState, useRef, useEffect } from "react";
import { FaFile } from "react-icons/fa6";
import {
  FaCalendar,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaNewspaper,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlayCircle } from "react-icons/fa";
import { Description, MediaItem } from "@/app/types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import RichText from "../common/RichText";
import { cleanRichText } from "@/app/utils/extractRichText";

interface ResourceDetailsProps {
  contentType: string;
  id: string;
  properties: {
    headline?: string;
    description?: Description;
    resource?: MediaItem[];
    resourceThumbnail?: MediaItem[];
    resourceType?: string[];
    topic?: string[];
    hostedOn?: string;
    date?: string;
    vimeoId?: string;
  };
}

const ResourceDetails: React.FC<{ content: ResourceDetailsProps }> = ({
  content,
}) => {
  const resource = content.properties;
  const resourceThumbnail =
    resource.resourceThumbnail && resource.resourceThumbnail.length
      ? resource.resourceThumbnail[0].url
      : null;
  const resourceFile =
    resource.resource && resource.resource.length
      ? resource.resource[0].url
      : null;

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const resourceType =
    resource?.resourceType &&
    resource?.resourceType.length > 0 &&
    resource?.resourceType[0];
  const getTypeIcon = () => {
    switch (resourceType) {
      case "Video":
        return <FaPlayCircle className="text-red text-base md:text-lg" />;
      case "Audio":
        return <FaVolumeUp className="text-red text-base md:text-lg" />;
      case "Report":
        return <FaFile className="text-red text-base md:text-lg" />;
      default:
        return <FaNewspaper className="text-red text-base md:text-lg" />;
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => {
      setAudioDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateProgress = () => {
      setAudioProgress(audio.currentTime);
    };

    if (isAudioPlaying) {
      const interval = setInterval(updateProgress, 500); // update twice a second
      return () => clearInterval(interval);
    }
  }, [isAudioPlaying]);
  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const cleanDescription = cleanRichText(resource.description);

  function formatSecondsToHMS(seconds: number) {
    const rounded = Math.round(seconds);
    const hrs = Math.floor(rounded / 3600);
    const mins = Math.floor((rounded % 3600) / 60);
    const secs = rounded % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }
  const handleDownload = async () => {
    if (!resourceFile || resourceFile === "#") return;

    try {
      const fileUrl = buildMediaUrl(resourceFile);
      const response = await fetch(fileUrl, { mode: "cors" });

      if (!response.ok) {
        console.error("Failed to fetch file");
        return;
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Determine filename
      const ext = blob.type.split("/")[1] || "pdf";
      const safeName =
        (resource.headline && resource.headline.replace(/[^\w\-]+/g, "_")) ||
        "resource";

      const fileName = `${safeName}.${ext}`;

      // Create temp download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName; // THIS WILL WORK NOW
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup object URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <section className="bg-lighter-blue relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 xl:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h3 className="heading-3 text-dark-blue mb-6">{resource.headline}</h3>

        {/* Metadata Row */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6">
          {/* Resource Type */}
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <span className="text-dark-blue text-sm md:text-base">
              {resourceType}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          {/* Author */}
          <div className="flex items-center gap-2">
            <FaUser className="text-red text-base md:text-lg" />
            <span className="text-dark-blue text-sm md:text-base break-words">
              {resource.hostedOn}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-gray-300"></div>

          {/* Publish Date */}
          <div className="flex items-center gap-2">
            <FaCalendar className="text-red text-base md:text-lg" />
            <span className="text-dark-blue text-sm md:text-base">
              {new Date(resource.date || 0).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Topics Section */}
        {resource.topic && resource.topic.length > 0 && (
          <div className="mb-4 md:mb-6 flex flex-row items-center gap-2 flex-wrap">
            <h5 className="text-dark-blue font-bold text-sm md:text-base whitespace-nowrap">
              Topics:
            </h5>
            <div className="flex flex-wrap gap-2">
              {resource.topic.map((topic, index) => (
                <button
                  key={index}
                  className="btn-white text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Separator Line */}
        <div className="border-t border-gray-300 mb-6"></div>

        {/* Summary/Description */}
        <div className="mb-8">
          <RichText
            html={cleanDescription}
            className="text-dark-blue text-lg leading-relaxed space-y-4"
          />
        </div>

        {/* Conditional Content Based on Resource Type */}
        {resourceType === "Video" && (
          /* Video Player */
          <div className="w-full mb-8">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              {/* Video Element */}
              {resource.vimeoId && (
                <iframe
                  src={`https://player.vimeo.com/video/${resource.vimeoId}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* Thumbnail or Placeholder */}
              {/* {!isVideoPlaying && (
                <>
                  {resourceThumbnail ? (
                    <img
                      src={buildMediaUrl(resourceThumbnail)}
                      alt={resource.headline}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-200 via-yellow-200 to-blue-300 flex items-center justify-center">
                      <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-blue-300 to-blue-400"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-b from-yellow-200 to-yellow-300"></div>
                        <div className="absolute bottom-1/3 left-1/4 w-8 h-16 bg-green-600 rounded-full"></div>
                        <div className="absolute bottom-1/3 left-1/2 w-10 h-20 bg-green-600 rounded-full"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-8 h-14 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </>
              )} */}
              {/* {!isVideoPlaying && (
                <button
                  onClick={handleVideoPlay}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all z-10"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <FaPlay className="text-dark-blue text-3xl ml-1" />
                  </div>
                </button>
              )} */}
            </div>
          </div>
        )}

        {resourceType === "Audio" && (
          /* Audio Player */
          <div className="w-full mb-8 bg-white rounded-full p-4 shadow-md">
            <div className="flex items-center gap-4">
              {/* Play Button */}
              <button
                onClick={handleAudioPlay}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
              >
                {isAudioPlaying ? (
                  <FaPause className="text-dark-blue text-lg ml-0.5" />
                ) : (
                  <FaPlay className="text-dark-blue text-lg ml-1" />
                )}
              </button>

              {/* Time Display */}
              <div className="flex items-center gap-2 text-dark-blue font-semibold min-w-[80px]">
                <span>{formatTime(audioProgress)}</span>
                <span>/</span>
                {<span>{formatSecondsToHMS(audioDuration || 0)}</span>}
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dark-blue transition-all duration-300"
                  style={{
                    width: `${
                      audioDuration ? (audioProgress / audioDuration) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>

              {/* Volume Control */}
              <button className="flex-shrink-0 text-dark-blue hover:text-blue-600 transition-colors">
                <FaVolumeUp className="text-xl" />
              </button>

              {/* More Options */}
              <button className="flex-shrink-0 text-dark-blue hover:text-blue-600 transition-colors">
                <BsThreeDotsVertical className="text-xl" />
              </button>

              {/* Hidden audio element */}
              {resourceFile && resourceFile !== "#" && (
                <audio
                  ref={audioRef}
                  src={buildMediaUrl(resourceFile)}
                  preload="metadata"
                  onTimeUpdate={() => {
                    if (audioRef.current) {
                      setAudioProgress(audioRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (audioRef.current?.duration) {
                      setAudioDuration(audioRef.current.duration);
                      setAudioProgress(0); // reset progress
                    }
                  }}
                  onPlay={() => setIsAudioPlaying(true)}
                  onPause={() => setIsAudioPlaying(false)}
                  onEnded={() => {
                    setIsAudioPlaying(false);
                    setAudioProgress(0);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {resourceType === "Report" && (
          /* Embedded Report Cover */
          <div className="bg-dark-blue rounded-2xl p-6 md:p-8 lg:p-10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
              {/* Logo Section - Left Side */}
              {/* Report Cover Image - Right Side */}
              <div className="flex-1 relative w-full md:w-auto">
                {resourceThumbnail ? (
                  <div
                    className="w-full md:w-[400px] lg:w-[500px] h-[300px] md:h-[350px] rounded-lg overflow-hidden bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${buildMediaUrl(
                        resourceThumbnail
                      )})`,
                    }}
                  >
                    {/* Overlay text on the cover image */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 bg-black bg-opacity-20">
                      <h2
                        className='text-2xl md:text-3xl font-bold mb-2 text-center !font-["Times_New_Roman"]'
                      >
                        {resource.headline}
                      </h2>
                    </div>
                  </div>
                ) : (
                  <div className="w-full md:w-[400px] lg:w-[500px] h-[300px] md:h-[350px] rounded-lg overflow-hidden relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                    {/* Simulated Arizona flag with sunset background */}
                    <div className="absolute inset-0">
                      {/* Sky gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-yellow-300 to-blue-400"></div>
                      {/* Flag representation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-2/3 bg-red-600 relative">
                          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-blue-600"></div>
                          <div className="absolute top-0 left-0 w-1/3 h-1/2 flex items-center justify-center">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                          </div>
                          <div className="absolute top-0 left-1/3 w-2/3 h-1/2 bg-red-600"></div>
                          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-yellow-400"></div>
                        </div>
                      </div>
                    </div>
                    {/* Overlay text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10">
                      <h2
                        className='text-2xl md:text-3xl font-bold mb-2 text-center drop-shadow-lg !font-["Times_New_Roman"]'
                      >
                        {resource.headline}
                      </h2>
                    </div>
                  </div>
                )}

                {/* Download PDF Button */}
                <button
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4 bg-light-orange hover:bg-orange-500 text-dark-blue font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
                >
                  Download PDF
                  <FiDownload className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResourceDetails;
