"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { FiX } from "react-icons/fi";
import { ContentRendererProps } from "../../types";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { HeroBannerProps } from "@/app/types/home/HeroBannerProps";

const LOCAL_KEY = "heroBannerNotificationClosedAt";
const HIDE_DAYS = 30;

const HeroBanner: React.FC<ContentRendererProps> = ({ content }) => {
    const {
        headline,
        subheadline,
        notificationText,
        backgroundImages = [],
    } = (content?.properties as HeroBannerProps) || {};

    // ---- SAFE RANDOM IMAGE ----
    const [selectedImage, setSelectedImage] = useState<any>(null);

    useEffect(() => {
        if (backgroundImages.length > 0) {
            const index = Math.floor(Math.random() * backgroundImages.length);
            setSelectedImage(backgroundImages[index]);
        }
    }, [backgroundImages]);

    const backgroundImageUrl = selectedImage
        ? buildMediaUrl(selectedImage.url)
        : "";

    // ---- Sticky + Header Height ----

    const [isNotificationVisible, setIsNotificationVisible] = useState(true);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    // Initialize with a reasonable default to prevent layout shift
    const [headerHeight, setHeaderHeight] = useState(180); // Default header height (122px header + 67px nav)
    const [bannerBaseHeight, setBannerBaseHeight] = useState(755);
    const [notificationHeight, setNotificationHeight] = useState(48); // Default notification height
    const [viewportHeight, setViewportHeight] = useState(0); // Actual viewport height for mobile
    const notificationRef = useRef<HTMLDivElement>(null);
    const bannerRef = useRef<HTMLElement>(null);

    // Calculate actual viewport height for mobile devices
    useLayoutEffect(() => {
        const updateViewportHeight = () => {
            // Use visualViewport.height if available (more accurate on mobile), otherwise window.innerHeight
            // visualViewport excludes browser UI (address bar, navigation bar)
            const height = window.visualViewport?.height || window.innerHeight;
            setViewportHeight(height);
        };

        // Set initial viewport height
        updateViewportHeight();

        // Update on resize and orientation change
        window.addEventListener("resize", updateViewportHeight);
        window.addEventListener("orientationchange", updateViewportHeight);
        // Also listen to visual viewport changes for better mobile support
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateViewportHeight);
        }

        return () => {
            window.removeEventListener("resize", updateViewportHeight);
            window.removeEventListener("orientationchange", updateViewportHeight);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updateViewportHeight);
            }
        };
    }, [isNotificationVisible]);

    // IntersectionObserver to detect when banner section scrolls out of view
    useEffect(() => {
        if (!bannerRef.current) return;

        // Check if main is scrollable, otherwise use viewport
        const mainElement = document.querySelector("main");
        const isMainScrollable =
            mainElement && mainElement.scrollHeight > mainElement.clientHeight;
        const rootElement = isMainScrollable ? mainElement : null;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // When banner is not intersecting (scrolled past), make notification sticky
                    // When banner is intersecting again (scrolled back up), remove sticky
                    setIsSticky(!entry.isIntersecting);
                });
            },
            {
                root: rootElement, // Use main as root if scrollable, otherwise viewport
                rootMargin: "0px",
                threshold: 0,
            }
        );

        observer.observe(bannerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    // Calculate header height and responsive banner height
    // Use useLayoutEffect to prevent flickering by running before paint
    useLayoutEffect(() => {
        const updateDimensions = () => {
            const header = document.querySelector("header");
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }

            // Update notification height if ref is available
            if (notificationRef.current) {
                setNotificationHeight(notificationRef.current.offsetHeight);
            }

            // Calculate responsive base height
            const width = window.innerWidth;
            if (width >= 1024) {
                // lg: 565px
                setBannerBaseHeight(565);
            } else if (width >= 768) {
                // md: 550px
                setBannerBaseHeight(550);
            } else {
                // default: 745px
                setBannerBaseHeight(745);
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [isNotificationVisible]);

    // Calculate header height for sticky positioning and update on resize
    useLayoutEffect(() => {
        const updateStickyPosition = () => {
            if (notificationRef.current) {
                if (isSticky) {
                    const header = document.querySelector("header");
                    const currentHeaderHeight = header ? header.offsetHeight : headerHeight;
                    notificationRef.current.style.top = `${currentHeaderHeight}px`;
                } else {
                    // Clear top style when not sticky to return to original position
                    notificationRef.current.style.top = "";
                }
            }
        };

        updateStickyPosition();
        window.addEventListener("resize", updateStickyPosition);

        return () => {
            window.removeEventListener("resize", updateStickyPosition);
        };
    }, [isSticky, headerHeight]);
    const closeNotification = () => {
        try {
            localStorage.setItem(LOCAL_KEY, String(Date.now()));
        } catch { }
        setIsNotificationVisible(false);
    };


    return (
        <>
            {/* HERO BANNER */}
            <section
                ref={bannerRef}
                className="relative w-full overflow-hidden"
                style={{
                    marginTop: `-${headerHeight}px`,
                    paddingTop: `${headerHeight}px`,
                    height: viewportHeight
                        ? `${viewportHeight - (isNotificationVisible ? notificationHeight : 0)}px`
                        : `calc(100vh - ${isNotificationVisible ? notificationHeight : 0}px)`,
                }}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: backgroundImageUrl
                            ? `url(${backgroundImageUrl})`
                            : undefined,
                        top: `-${headerHeight}px`,
                        height: `calc(100% + ${headerHeight}px)`,
                    }}
                />

                {/* Gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(30,58,138,0.5), rgba(88,28,135,0.7))",
                        top: `-${headerHeight}px`,
                        height: `calc(100% + ${headerHeight}px)`,
                    }}
                />

                {/* Text */}
                <div className="relative z-10 h-full flex flex-col items-center justify-end text-center pb-12 md:pb-16 lg:pb-20">
                    {headline && (
                        <h1 className="heading-1 text-white font-bold mb-6">{headline}</h1>
                    )}

                    {subheadline && (
                        <p className="text-lighter-blue text-xl max-w-4xl">{subheadline}</p>
                    )}
                </div>
            </section >

            {/* NOTIFICATION BAR */}
            {
                isNotificationVisible && notificationText && (
                    <div
                        ref={notificationRef}
                        className={`w-full py-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-[linear-gradient(to_right,#F97C1A,#FCB447)] transition-all duration-300 ${isSticky ? "fixed left-0 z-[40] shadow-md" : "relative"
                            }`}
                    >
                        <p className="body-text text-[#0A0A0A] flex-1 text-center !leading-[1.6]">{notificationText}</p>

                        <button
                            onClick={closeNotification}
                            className="ml-4 flex-shrink-0 text-gray-900 hover:text-black"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                )
            }
        </>
    );
};

export default HeroBanner;
