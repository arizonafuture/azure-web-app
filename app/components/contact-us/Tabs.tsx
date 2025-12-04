"use client";

import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  activeTab:  "requestHelp" | "shareStory" | "generalFeedback" | null;
  setActiveTab: (tab:  "requestHelp" | "shareStory" | "generalFeedback" | null) => void;
  setSubmitted: (v: boolean) => void;
  children: React.ReactNode;
}

export default function Tabs({ activeTab, setActiveTab, setSubmitted,children }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const tabs = [
    { id: "requestHelp", label: "Request Help With a Story" },
    { id: "shareStory", label: "Share a Story" },
    { id: "generalFeedback", label: "General Feedback" },
  ] as const;

  // ---------------- MOBILE MODE (ACCORDION WITH CONTENT) ----------------
  if (isMobile) {
    return (
      <div className="space-y-2">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;

          return (
            <div key={t.id} className="rounded-xl overflow-hidden">
              {/* Accordion Button */}
              <button
                className="
                w-full px-4 py-5 font-bold !font-[Verdana] flex justify-between items-center bg-[var(--light-orange-color)] text-dark-blue
              "
                onClick={() => {
                  // TOGGLE MOBILE TAB
                if (isActive) {
                  setActiveTab(null); // CLOSE TAB
                } else {
                  setActiveTab(t.id); // OPEN TAB
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                
              >
                {t.label}
                <span>
                  <FiChevronDown
                    className={`text-dark-blue text-l transition-transform ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {/* DROPDOWN CONTENT (form inside the accordion) */}
              {isActive && (
                <div className="px-[15px] py-7.5 bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)] rounded-b-xl border-t-[3px] border-t-[var(--orange-color)]">
                  {children}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ---------------- DESKTOP MODE (HORIZONTAL TABS) ----------------
  return (
    <div>    
      <div className="flex rounded-t-xl overflow-hidden bg-[var(--white-color)] border-b-[3px] border-b-[var(--orange-color)]">
      {tabs.map((t, index) => {
        const active = activeTab === t.id;

        return (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setSubmitted(false);
            }}
            className={`
                flex-1 
                px-4 
                py-5 
                text-sm 
                md:text-base 
                !font-[Verdana] 
                font-bold 
                transition-all 
                text-[var(--dark-blue-color)]
                ${
                  active
                    ? "bg-[var(--light-orange-color)]"
                    : "bg-[var(--white-color)]"
                }
                ${
                  index !== tabs.length - 1
                    ? "border-r-[1.5px] border-r-[var(--gray-color)]"
                    : ""
                }
              `}
          >
            {t.label}
          </button>
        );
      })}
      </div>
      <div className="rounded-b-xl bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)]">
        {children}
      </div>
    </div>
    
  );
}
