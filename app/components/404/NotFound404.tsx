"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../components/common/Button";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { UMBRACO_404 } from "@/app/config/umbraco";

interface NotFound404Props {
    backgroundImage?: { url: string }[];
    headline?: string;
    subHeadline?: string;
    descriptionText?: string;
    actioncta?: {
        route?: { path?: string };
        url?: string;
        title: string;
    }[];
}

const NotFound404 = () => {
    const [data, setData] = useState<NotFound404Props | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${UMBRACO_404}`,
                    {
                        cache: "no-store",
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch Not Found Page");
                const apiData = await res.json();

                const notFoundContent =
                    apiData?.properties?.content?.items?.[0]?.content?.properties;

                setData(notFoundContent);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return (
            <section className="w-full py-20 text-center">
                <p className="text-dark-blue">Loading...</p>
            </section>
        );
    }

    const { backgroundImage, headline, subHeadline, descriptionText, actioncta } =
        data;

    const bgUrl =
        backgroundImage && backgroundImage.length > 0
            ? buildMediaUrl(backgroundImage[0].url)
            : "";

    return (
        <section
            className="relative w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Cloud shapes */}
            <div
                className="absolute top-0 left-0 w-[500px] h-[400px] opacity-25"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 20% 20%, #e59969 0%, transparent 60%)",
                    borderRadius: "50%",
                    transform: "translate(-25%, -25%)",
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-[500px] h-[400px] opacity-25"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 20% 80%, #e59969 0%, transparent 60%)",
                    borderRadius: "50%",
                    transform: "translate(-25%, 25%)",
                }}
            />
            <div
                className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-25"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 80% 80%, #e59969 0%, transparent 60%)",
                    borderRadius: "50%",
                    transform: "translate(25%, 25%)",
                }}
            />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h1 className="heading-1 !text-[150px] !font-bold text-dark-blue mb-4 font-times-new-roman">
                    {headline ?? "404"}
                </h1>

                <h2 className="heading-2 !font-bold text-dark-blue mb-6 font-times-new-roman">
                    {subHeadline ?? "Page Not Found"}
                </h2>

                {descriptionText && (
                    <p className="body-text-large text-dark-blue max-w-2xl mx-auto leading-relaxed mb-12 whitespace-pre-line">
                        {descriptionText}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {actioncta?.map((cta, index) => {
                        const href = cta.route?.path || cta.url || "/";
                        return (
                            <Link key={index} href={href} className="w-full sm:w-auto">
                                <Button variant="dark-blue" showArrow={true}>
                                    {cta.title}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default NotFound404;
