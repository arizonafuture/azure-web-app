"use client";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import Button from "../common/Button";
import { ContentRendererProps, MediaItem } from "@/app/types";
import { AboutUsSectionprops } from "@/app/types/home/AboutUsSectionprops";



const AboutUsSection = ({ content }: ContentRendererProps) => {
    const { heading, description, buttonUrl, backGroundImage } = content.properties as AboutUsSectionprops

    const bgUrl =
        backGroundImage && backGroundImage.length > 0
            ? buildMediaUrl(backGroundImage[0].url)
            : "";


    const button = buttonUrl?.[0];
    const buttonPath = button?.route?.path || button?.url || "#";
    const buttonTitle = button?.title || "";

    return (
        <section
            className="relative w-full min-h-[600px] md:min-h-[700px] px-[15px] md:px-[135px] md:py-20 py-10 flex items-center"
            style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Purple Overlay Box */}
            <div
                className="relative w-full max-w-full sm:max-w-[90%] md:max-w-[600px] lg:max-w-[650px] xl:max-w-[700px] rounded-2xl flex flex-col justify-center p-[30px] md:p-[70px] z-10"
                style={{
                    background: `
                    linear-gradient(310deg, rgba(81, 12, 81, 0.65), rgba(81, 12, 81)),
                    linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))
                `,
                }}
            >
                {/* Title */}
                <h2 className="heading-2 !font-bold text-white mb-2 md:mb-4">
                    {heading}
                </h2>

                {/* Description */}
                <p className="body-text-large text-white leading-relaxed mb-6 sm:mb-8 md:mb-10">
                    {description}
                </p>

                {/* Button */}
                {button && (
                    <div className="w-fit">
                        <a href={buttonPath}>
                            <Button variant="white" className="btn-white !py-[5px]" showArrow={true}>
                                {buttonTitle}
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AboutUsSection;
