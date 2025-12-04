"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiSearch, FiX, FiMenu } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

interface NavItem {
  label: string;
  path: string;
  dropdown?: { label: string; path: string }[];
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        setIsScrolled(mainElement.scrollTop > 0);
      }
    };
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.addEventListener("scroll", handleScroll);
      return () => mainElement.removeEventListener("scroll", handleScroll);
    }
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

    // Use a small delay to ensure this runs after React's onClick handler completes
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdown]);

  const navItems: NavItem[] = [
    { label: "Searchable Data", path: "/searchable-data" },
    {
      label: "Key Topics",
      path: "/key-topics",
      dropdown: [
        { label: "Civic Health", path: "/civic-health" },
        { label: "Housing", path: "/housing" },
        { label: "Education", path: "/education" },
        { label: "Immigration", path: "/immigration" },
        { label: "Elections", path: "/elections" },
        { label: "Infrastructure", path: "/infrastructure" },
        { label: "Environment & Water", path: "/environment-water" },
        { label: "Jobs", path: "/jobs" },
        { label: "Health", path: "/health" },
        { label: "Future Outlook", path: "/future-outlook" },
      ],
    },
    { label: "Info Sessions", path: "/info-session" },
    { label: "Independent Experts", path: "/independent-experts" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact Us", path: "/contact-us" },
  ];

  const isActiveNavItem = (item: NavItem): boolean => {
    return (
      pathname === item.path ||
      (item.dropdown && item.dropdown.some((d) => pathname === d.path)) ||
      false
    );
  };

  const handleNavClick = (
    item: NavItem,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActiveDropdown(null);
    router.push(item.path);
  };

  const handleDropdownItemClick = (item: { label: string; path: string }) => {
    setActiveDropdown(null);
    router.push(item.path);
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
    if (item.dropdown) {
      setMobileDropdown(mobileDropdown === item.label ? null : item.label);
    } else {
      router.push(item.path);
      setIsMobileMenuOpen(false);
      setMobileDropdown(null);
    }
  };

  const handleMobileDropdownItemClick = (item: {
    label: string;
    path: string;
  }) => {
    router.push(item.path);
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  return (
    <>
      <header
        className={`bg-white w-full transition-all duration-300 sticky top-0 z-[50] ${
          isScrolled ? "shadow-md" : "rounded-b-[16px]"
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block pl-[60px]">
          <div className="flex items-start justify-between">
            {/* Left: Logo Section */}
            <div
              className="flex items-center cursor-pointer w-[367.31px] h-[122px] gap-10"
              onClick={() => router.push("/")}
            >
              <img
                src="/logo.png"
                alt="Arizona Media Institute Logo"
                className="w-[247.31px] h-[82px]"
              />
            </div>

            {/* Right: Action Buttons and Navigation */}
            <div className="flex flex-col flex-1 items-end">
              {/* Top Row: Search and My Account Buttons - No gap */}
              <div className="flex items-center gap-0">
                {/* Search */}
                {isSearchOpen ? (
                  <div className="flex items-center h-[37px] gap-2 rounded-bl-[16px] px-3 bg-[#272F69] min-w-[670px] w-auto">
                    <div className="p-1 rounded flex-shrink-0">
                      <FiSearch className="text-[#FCB447]" size={18} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent text-white placeholder-gray-300 placeholder-opacity-70 outline-none flex-1 text-sm font-['Verdana']"
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      className="text-white hover:text-gray-300 transition-colors flex-shrink-0"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleSearch}
                    className="flex items-center text-white transition-colors duration-200 w-[156px] h-[37px] gap-2 rounded-bl-[16px] pt-[10px] pr-10 pb-[10px] pl-10 hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(0deg, #272F69, #272F69), linear-gradient(90deg, #18254D 0%, rgba(24, 37, 77, 0) 100%)",
                    }}
                  >
                    <FiSearch size={14} />
                    <span className="text-sm font-medium">Search</span>
                  </button>
                )}

                {/* My Account - No gap, connected to Search, no gap right */}
                <button
                  onClick={() => router.push("/my-account")}
                  className="flex items-center justify-center text-dark transition-colors duration-200 w-[194px] h-[37px] gap-[10px] p-[10px] ml-0 hover:opacity-90 bg-[linear-gradient(90deg,#F97C1A_0%,#FCB447_100%)]"
                >
                  <FaUser size={14} />
                  <span className="text-sm font-bold">My Account</span>
                </button>
              </div>

              {/* Bottom Row: Navigation Links - No gap above */}
              <nav className="flex items-center !mt-5 h-[67px] gap-2 mr-0  pr-10">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative h-[67px]"
                    ref={(el) => {
                      if (item.dropdown && el) {
                        dropdownRefs.current[item.label] = el;
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.dropdown) {
                        setActiveDropdown(null);
                        setHoveredNavItem(null);
                      }
                    }}
                  >
                    {hoveredNavItem === item.label &&
                      !isActiveNavItem(item) && (
                        <span className="absolute top-0 left-0 right-0 bottom-0 bg-blue-100 rounded-t-md" />
                      )}
                    <button
                      onClick={(e) => handleNavClick(item, e)}
                      onMouseEnter={() => {
                        setHoveredNavItem(item.label);
                        if (item.dropdown) {
                          setActiveDropdown(item.label);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!item.dropdown) {
                          setHoveredNavItem(null);
                        }
                      }}
                      className="px-3 py-2 text-sm font-normal transition-all duration-200 relative text-[#1e3a8a] z-10"
                    >
                      {item.label}
                    </button>
                    {hoveredNavItem === item.label &&
                      !isActiveNavItem(item) && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a] z-10" />
                      )}
                    {isActiveNavItem(item) && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#1e3a8a] z-10" />
                    )}

                    {/* Dropdown Menu */}
                    {item.dropdown && activeDropdown === item.label && (
                      <div
                        className="absolute top-full left-[-15px] bg-white rounded-b-2xl shadow-lg py-4 px-4 z-[100] min-w-[500px] grid grid-cols-2 gap-0"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                      >
                        {item.dropdown.map((dropdownItem, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleDropdownItemClick(dropdownItem)
                            }
                            className="text-left px-3 py-1 text-sm font-normal rounded-md transition-colors duration-200 text-[#374151] bg-transparent hover:underline hover:font-bold hover:text-red-600"
                          >
                            {dropdownItem.label}
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
              onClick={toggleSearch}
              className="flex-1 flex items-center justify-center gap-2 h-[37px] bg-[#272F69] text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity"
            >
              <FiSearch size={16} />
              <span>Search</span>
            </button>

            {/* My Account Button - Right Half */}
            <button
              onClick={() => router.push("/my-account")}
              className="flex-1 flex items-center justify-center gap-2 h-[37px] text-white font-bold text-sm uppercase hover:opacity-90 transition-opacity bg-[linear-gradient(90deg,#F97C1A_0%,#FCB447_100%)]"
            >
              <FaUser size={16} />
              <span>My Account</span>
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
                  src="/logo.png"
                  alt="Arizona Media Institute Logo"
                  className="h-10 w-auto"
                />
              </div>

              {/* Hamburger Menu Icon */}
              <button
                onClick={toggleMobileMenu}
                className="text-[#272F69] p-2 hover:opacity-70 transition-opacity"
                aria-label="Toggle menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          )}

          {/* Mobile Search Input (when search is open) */}
          {isSearchOpen && (
            <div className="px-4 pb-3 bg-[#272F69]">
              <div className="flex items-center gap-2 bg-[#272F69] px-2 pt-3">
                <FiSearch className="text-[#FCB447]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-white placeholder-gray-300 placeholder-opacity-70 outline-none flex-1 text-sm"
                  autoFocus
                />
                <button
                  onClick={toggleSearch}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

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
                src="/logo.png"
                alt="Arizona Media Institute Logo"
                className="h-10 w-auto"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-[#272F69] p-2 hover:opacity-70 transition-opacity"
              aria-label="Close menu"
            >
              <FiX size={28} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-200">
                <button
                  onClick={() => handleMobileNavClick(item)}
                  className={`w-full text-left px-4 py-4 font-medium text-base transition-colors flex items-center justify-between ${
                    mobileDropdown === item.label
                      ? "text-red-600"
                      : isActiveNavItem(item)
                      ? "text-red-600"
                      : "text-[#272F69]"
                  } hover:bg-gray-50`}
                >
                  <span>{item.label}</span>
                  {item.dropdown && <span className="text-[#272F69]">▼</span>}
                </button>

                {/* Mobile Dropdown */}
                {item.dropdown && mobileDropdown === item.label && (
                  <div className="bg-white">
                    {item.dropdown.map((dropdownItem, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleMobileDropdownItemClick(dropdownItem)
                        }
                        className={`w-full text-left px-8 py-3 text-sm transition-colors hover:bg-gray-50 ${
                          pathname === dropdownItem.path
                            ? "text-red-600 font-semibold underline"
                            : "text-gray-600"
                        }`}
                      >
                        {dropdownItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
