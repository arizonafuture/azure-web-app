"use client";

import { API_BASE_URL, CONTENT_ITEM_API_URL } from "@/app/config/umbraco";
import { fetchContentByPath } from "@/app/utils/fetchContent";
import { useState, useEffect, useRef } from "react";
import { BsChevronLeft, BsChevronRight, BsChevronDown } from "react-icons/bs";

interface SectionInfo {
  label: string;
  sectionId: string;
}

const KeyTopicsNav = () => {
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [activeItem, setActiveItem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // ✅ DIRECT FETCH: Umbraco content & use sectionId as label
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const currentPath = window.location.pathname; // same as your path
        // adjust base URL if Umbraco is on another domain
        const data = await fetchContentByPath(currentPath);
        if (data?.properties?.content?.items) {
          const validSections: SectionInfo[] = data.properties.content.items
            .map((item: any) => {
              const rawId = item?.settings?.properties?.sectionId?.trim();
              if (!rawId) return null;

              // Convert sectionId → readable label
              const label = rawId
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase());

              return { label, sectionId: rawId };
            })
            .filter((s: SectionInfo | null): s is SectionInfo => !!s);

          setSections(validSections);

          if (validSections.length > 0) {
            setActiveItem(validSections[0].label);
          }
        }
      } catch (err: any) {
        console.error("Error fetching sections", err);
        setError(err?.message ?? "Failed to load sections");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // ✅ Scroll to section
  const handleNavClick = (label: string, sectionId: string) => {
    setActiveItem(label);
    setIsMobileDropdownOpen(false);

    const target = document.getElementById(sectionId);
    if (!target) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
    const offset = headerHeight + navHeight;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: targetPosition - offset,
      behavior: "smooth",
    });
  };

  // ✅ Scroll buttons visibility
  const checkScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setShowLeftArrow(el.scrollLeft > 0);
      setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, []);

  // ✅ Sticky behavior
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // ✅ Mobile detection
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ✅ Click outside closes dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        dropdownMenuRef.current?.contains(target)
      )
        return;
      setIsMobileDropdownOpen(false);
    };
    if (isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileDropdownOpen]);

  // IntersectionObserver to detect when PageHeader scrolls out of view
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (!mainElement) return;

    // Find the PageHeader (first div child in main)
    const pageHeader = mainElement.querySelector("div:first-child");
    if (!pageHeader) return;

    // Check if main is scrollable, otherwise use viewport
    const isMainScrollable =
      mainElement.scrollHeight > mainElement.clientHeight;
    const rootElement = isMainScrollable ? mainElement : null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSticky(!entry.isIntersecting);
        });
      },
      {
        root: rootElement,
        rootMargin: "0px",
        threshold: 0,
      }
    );

    observer.observe(pageHeader);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Calculate header height for sticky positioning and update on resize
  useEffect(() => {
    const updateStickyPosition = () => {
      if (navRef.current) {
        if (isSticky) {
          const header = document.querySelector("header");
          const headerHeight = header ? header.offsetHeight : 0;
          navRef.current.style.top = `${headerHeight}px`;
        } else {
          navRef.current.style.top = "";
        }
      }
    };

    updateStickyPosition();
    window.addEventListener("resize", updateStickyPosition);

    return () => {
      window.removeEventListener("resize", updateStickyPosition);
    };
  }, [isSticky]);

  // ⛔ same condition you already had
  if (loading || error || !sections.length) return null;

  return (
    <nav
      ref={navRef}
      className={`w-full py-3.5 px-14 sm:px-6 md:px-24 md:py-4 bg-[linear-gradient(90deg,#f97c1a_0%,#fcb447_100%)] transition-all duration-300 ${
        isSticky ? "sticky z-[40] shadow-md" : "relative"
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto relative">
        {/* ---------- MOBILE DROPDOWN ---------- */}
        <div className="lg:hidden relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex items-center justify-center font-bold text-base text-dark-blue py-2 px-4 relative !font[Verdana]"
          >
            <span className="text-center">{activeItem}</span>
            <BsChevronDown
              size={20}
              className={`text-dark-blue transition-transform ${
                isMobileDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* ---------- DESKTOP NAV (SCROLLABLE) ---------- */}
        <div className="hidden lg:flex items-center justify-center relative">
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-20 flex items-center justify-center w-8 h-8 text-dark-blue hover:opacity-80 transition-opacity"
            >
              <BsChevronLeft size={30} className="text-dark-blue" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="mx-15 overflow-x-auto hide-scrollbar flex items-center"
            style={{
              scrollBehavior: "smooth",
            }}
          >
            <div className="flex items-center min-w-max mx-auto">
              {sections.map((s, i) => (
                <div
                  key={s.sectionId}
                  className="flex items-center flex-shrink-0"
                >
                  <button
                    onClick={() => handleNavClick(s.label, s.sectionId)}
                    className={`body-text-large !font-bold sm:text-base transition-all whitespace-nowrap ${
                      activeItem === s.label
                        ? "text-dark-blue"
                        : "text-dark-blue hover:opacity-80"
                    }`}
                  >
                    {s.label}
                  </button>

                  {i < sections.length - 1 && (
                    <div
                      className="h-6 w-px mx-3 sm:mx-4 md:mx-6 flex-shrink-0"
                      style={{ backgroundColor: "rgba(24, 37, 78, 0.2)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 z-20 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <BsChevronRight size={30} className="text-dark-blue" />
            </button>
          )}
        </div>
      </div>

      {/* ---------- MOBILE DROPDOWN MENU ---------- */}
      {isMobileDropdownOpen && (
        <div
          ref={dropdownMenuRef}
          className="lg:hidden absolute left-0 w-full bg-white shadow-md z-50"
          style={{
            borderColor: "var(--blue-color)",
            maxHeight: "17rem",
            overflowY: "auto",
            top: "100%",
            left: "0",
            right: "0",
          }}
        >
          {sections.map((s, index) => (
            <div key={s.sectionId}>
              {index > 0 && (
                <div
                  className="h-px bg-gray-200"
                  style={{
                    marginLeft: "1rem",
                    marginRight: "1rem",
                  }}
                />
              )}

              <button
                onClick={() => handleNavClick(s.label, s.sectionId)}
                className={`w-full text-center py-3 px-4 text-sm transition-colors !font[Verdana] ${
                  activeItem === s.label
                    ? "font-bold text-dark-blue"
                    : "font-normal text-dark-blue"
                }`}
              >
                {s.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default KeyTopicsNav;
