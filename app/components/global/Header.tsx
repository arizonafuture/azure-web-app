"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { HeaderProps, NavItem } from "@/app/types/headerfooter";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { checkAuth } from "@/app/server/checkAuth";

const Header: React.FC<HeaderProps & { initialToken?: string }> = ({
  logo,
  whiteLogo,
  navMenu = [],
  siteName,
  account,
  search,
  initialToken,
}) => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);

  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector("main");
      const windowScroll = window.scrollY > 0;
      const mainScroll = mainElement ? mainElement.scrollTop > 0 : false;
      setIsScrolled(windowScroll || mainScroll);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      let clickedInside = false;
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedInside = true;
        }
      });
      if (!clickedInside) {
        setActiveDropdown(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdown]);

  // --- Normalization helper and improved active check ---
  const normalizePath = (p: string) => {
    if (!p) return "/";
    // ensure starts with a slash
    let np = p.startsWith("/") ? p : `/${p}`;
    // remove trailing slash (but keep root "/")
    if (np.length > 1 && np.endsWith("/")) {
      np = np.slice(0, -1);
    }
    return np;
  };

  const isActiveNavItem = (item: NavItem): boolean => {
    const current = normalizePath(pathname);
    const itemUrl = normalizePath(item.url ?? "/");

    // exact match
    if (current === itemUrl) return true;

    // if item has children and any child's normalized url equals current
    if (
      item.children &&
      item.children.some((d) => normalizePath(d.url ?? "/") === current)
    ) {
      return true;
    }

    // treat item as section root: if current is nested under itemUrl (like /blog/post)
    // but avoid treating "/" as a prefix for everything
    if (itemUrl !== "/" && current.startsWith(itemUrl + "/")) return true;

    return false;
  };
  // ----------------------------------------------------

  const handleNavClick = (
    item: NavItem,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActiveDropdown(null);
    // use type="button" on buttons to avoid accidental form submits (below)
    router.push(item.url);
  };

  const handleDropdownItemClick = (item: NavItem) => {
    setActiveDropdown(null);
    router.push(item.url);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (item: NavItem) => {
    if (item.children) {
      setMobileDropdown(mobileDropdown === item.title ? null : item.title);
    } else {
      router.push(item.url);
      setIsMobileMenuOpen(false);
      setMobileDropdown(null);
    }
  };

  const handleMobileDropdownItemClick = (item: NavItem) => {
    router.push(item.url);
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  useEffect(() => {
    async function syncAuth() {
      const logged = await checkAuth();
      setIsLoggedIn(logged);
    }
    syncAuth();
  }, [pathname]);

  return (
    <>
      <header
        className={`bg-white w-full sticky top-0 z-[50] transition-all duration-300 ${isScrolled
          ? "shadow-lg rounded-b-none"
          : "shadow-none rounded-b-[16px]"
          }`}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block pl-[60px]">
          <div className="flex items-start justify-between">
            {/* Left: Logo Section */}
            <div
              className="flex items-center cursor-pointer h-[122px] gap-10"
              onClick={() => router.push("/")}
            >
              <img
                src={buildMediaUrl(logo)}
                alt={siteName}
                className="w-[247.31px] h-[82px]"
              />
            </div>

            {/* Right: Action Buttons and Navigation */}
            <div className="flex flex-col flex-1 items-end">
              {/* Top Row: Search and My Account Buttons - No gap */}
              <div className="flex items-center gap-0">
                {/* Search */}
                {isSearchOpen ? (
                  <div className="flex items-center h-[37px] gap-2 rounded-bl-[16px] px-3 bg-blue min-w-[670px] w-auto">
                    <div className="p-1 rounded flex-shrink-0">
                      <FiSearch className="text-[var(--light-orange-color)]" size={18} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim()) {
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          setIsSearchOpen(false);
                        }
                      }}
                      placeholder="Search..."
                      className="text-white placeholder-gray-300 placeholder-opacity-70 outline-none flex-1 text-sm font-['Verdana']"
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      type="button"
                      className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="flex items-center text-white transition-colors duration-200 w-[156px] h-[37px] gap-2 rounded-bl-[16px] pt-[10px] pr-10 pb-[10px] pl-10 hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(0deg, #272F69, #272F69), linear-gradient(90deg, #18254D 0%, rgba(24, 37, 77, 0) 100%)",
                    }}
                  >
                    <FiSearch size={14} />
                    <span className="text-sm font-bold">{search}</span>
                  </button>
                )}

                {/* My Account - No gap, connected to Search, no gap right */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(isLoggedIn ? "/my-account" : "/login")
                  }
                  className="cursor-pointer bg-orange-gradient flex items-center justify-center text-dark transition-colors duration-200 w-[194px] h-[37px] gap-[10px] p-[10px] ml-0 hover:opacity-90"
                >
                  <FaUser size={14} />
                  <span className="text-sm font-bold">
                    {" "}
                    {isLoggedIn ? "My Account" : "Login"}
                  </span>
                </button>
              </div>

              {/* Bottom Row: Navigation Links - No gap above */}
              <nav className="flex items-center !mt-5 h-[67px] gap-2 mr-0 cursor-pointer pr-10">
                {navMenu.map((item) => (
                  <div
                    key={item.title}
                    className="relative h-[67px]"
                    ref={(el) => {
                      if (item.children && el) {
                        dropdownRefs.current[item.title] = el;
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.children) {
                        setActiveDropdown(null);
                        setHoveredNavItem(null);
                      }
                    }}
                  >
                    {hoveredNavItem === item.title &&
                      !isActiveNavItem(item) && (
                        <span className="absolute top-0 left-0 right-0 bottom-0 bg-blue-100 rounded-t-md cursor-pointer" />
                      )}
                    <button
                      type="button"
                      onClick={(e) => handleNavClick(item, e)}
                      onMouseEnter={() => {
                        setHoveredNavItem(item.title);
                        if (item.children) {
                          setActiveDropdown(item.title);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!item.children) {
                          setHoveredNavItem(null);
                        }
                      }}
                      className={`px-3 py-2 text-base font-normal transition-all duration-200 relative text-dark-blue z-10 ${isActiveNavItem(item) ? "font-semibold" : ""
                        }`}
                    >
                      {item.title}
                    </button>
                    {hoveredNavItem === item.title &&
                      !isActiveNavItem(item) && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a] z-10" />
                      )}
                    {isActiveNavItem(item) && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a] z-10" />
                    )}

                    {/* Dropdown Menu */}
                    {item.children &&
                      item.children.length > 0 &&
                      activeDropdown === item.title && (
                        <div
                          className="absolute top-full left-[-15px] bg-white rounded-b-2xl shadow-lg py-4 px-4 z-[100] min-w-[500px] grid grid-cols-2 gap-0"
                          onMouseEnter={() => setActiveDropdown(item.title)}
                        >
                          {item.children.map((dropdownItem, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleDropdownItemClick(dropdownItem)
                              }
                              className={`text-left px-3 py-1 text-sm font-normal rounded-md transition-colors duration-200 text-[#374151] bg-transparent hover:underline hover:font-bold hover:text-red-600 ${normalizePath(pathname) ===
                                normalizePath(dropdownItem.url ?? "")
                                ? "font-semibold"
                                : ""
                                }`}
                            >
                              {dropdownItem.title}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden overflow-hidden">
          {/* Top Bar: Search and My Account */}
          <div className="flex items-center w-full">
            {/* Search Button - Left Half */}
            <button
              type="button"
              onClick={toggleSearch}
              className="flex-1 flex items-center justify-center gap-2 h-[37px] bg-blue text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity"
            >
              <FiSearch size={16} />
              <span>{search}</span>
            </button>

            {/* My Account Button - Right Half */}
            <button
              type="button"
              onClick={() => router.push(isLoggedIn ? "/my-account" : "/login")}
              className="flex-1 flex items-center justify-center gap-2 h-[37px] text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity bg-[linear-gradient(90deg,#F97C1A_0%,#FCB447_100%)]"
            >
              <FaUser size={16} />
              <span> {isLoggedIn ? "My Account" : "Login"}</span>
            </button>
          </div>

          {/* Bottom Bar: Logo and Hamburger Menu - Hide when menu is open */}
          {!isMobileMenuOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-lg">
              {/* Logo Section */}
              <div
                className="flex items-center cursor-pointer gap-2"
                onClick={() => router.push("/")}
              >
                <img
                  src={buildMediaUrl(logo)}
                  alt={siteName}
                  className="h-10 w-auto"
                />
              </div>

              {/* Hamburger Menu Icon */}
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="text-[var(--blue-color)] p-2 hover:opacity-70 transition-opacity"
                aria-label="Toggle menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          )}

          {/* Mobile Search Input (when search is open) */}
          {isSearchOpen && (
            <div className="px-4 pb-3 bg-[var(--blue-color)]">
              <div className="flex items-center gap-2 bg-blue px-2 pt-3">
                <FiSearch className="text-[var(--light-orange-color)]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Search..."
                  className="text-white placeholder-gray-300 placeholder-opacity-70 outline-none flex-1 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}


          {/* Mobile Menu - Full Width Below Header */}
          {isMobileMenuOpen && (
            <div className="lg:hidden w-full bg-white rounded-t-2xl overflow-hidden">
              {/* Internal Header with Logo and Close Button */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                {/* Logo Section */}
                <div
                  className="flex items-center cursor-pointer gap-2"
                  onClick={() => {
                    router.push("/");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <img
                    src={buildMediaUrl(logo)}
                    alt={siteName}
                    className="h-10 w-auto"
                  />
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className="text-blue-color p-2 hover:opacity-70 transition-opacity"
                  aria-label="Close menu"
                >
                  <FiX size={28} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col">
                {navMenu.map((item) => (
                  <div key={item.title} className="border-b border-gray-200">
                    <button
                      type="button"

                      onClick={() => {
                        if (item.children && item.children.length > 0) {
                          // toggle dropdown if it has children
                          setMobileDropdown(mobileDropdown === item.title ? null : item.title);
                        } else {
                          // navigate immediately if NO children
                          router.push(item.url);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className={`w-full text-left px-4 py-4 font-medium text-base transition-colors flex items-center justify-between ${mobileDropdown === item.title
                        ? "text-red-600"
                        : isActiveNavItem(item)
                          ? "text-red-600"
                          : "text-[#272F69]"
                        } hover:bg-gray-50`}
                    >
                      <span>{item.title}</span>

                      {/* ONLY show dropdown arrow if parent actually has children */}
                      {/* {item.children && item.children.length > 0 && (
                    <span className="text-[var(--blue-color)]">▼</span>
                  )} */}

                      {item.children && item.children.length > 0 && (
                        <span className="text-[#272F69]">
                          {mobileDropdown === item.title ? "▲" : "▼"}
                        </span>
                      )}
                    </button>


                    {/* Mobile Dropdown */}
                    {item.children &&
                      item.children.length > 0 &&
                      mobileDropdown === item.title && (
                        <div className="bg-white">
                          {item.children.map((dropdownItem, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleMobileDropdownItemClick(dropdownItem)
                              }
                              className={`w-full text-left px-8 py-3 text-sm transition-colors hover:bg-gray-50 ${normalizePath(pathname) ===
                                normalizePath(dropdownItem.url ?? "")
                                ? "text-red-600 font-semibold underline"
                                : "text-gray-600"
                                }`}
                            >
                              {dropdownItem.title}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>

  );
};

export default Header;
