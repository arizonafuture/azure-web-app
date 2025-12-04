// src/components/LinkRenderer.tsx (new file)
import React from "react";
import Link from "next/link"; // For internal SPA links
import { LinkItem, Route } from "../../types"; // Import LinkItem and Route

interface LinkRendererProps {
  link: LinkItem | null; // The link data from JSON
  className?: string; // Optional: Custom Tailwind classes (overrides default)
  children?: React.ReactNode; // Optional: Link text (default: "Learn More")
  showIcon?: boolean; // Optional: Show/hide chevron (default: true)
  iconClassName?: string; // Optional: Custom icon classes
}

const LinkRenderer: React.FC<LinkRendererProps> = ({
  link,
  className = "",
  showIcon = true,
  iconClassName = "ml-2 text-primary group-hover:translate-x-1 transition-transform duration-300",
}) => {
  if (!link) return null; // No link: Render nothing

  // Helper to resolve href (internal route.path or external url)
  const getLinkHref = (item: LinkItem): string => {
    if (item.linkType === "External" && item.url) {
      return item.url;
    }
    if (item.linkType === "Content") {
      if (item.route && typeof item.route !== "string") {
        const routeObj = item.route as Route;
        return routeObj.path || "#";
      }
      return (item.route ? (item.route as string) : "") || "#";
    }
    return "#";
  };

  const href = getLinkHref(link);
  const isExternal = link.linkType === "External" && link.url;
  const linkText = link.title || "Learn More";

  const baseClasses =
    "text-center text-lg group duration-300 ease-in-out font-medium text-primary mt-2 overflow-hidden flex items-center relative after:absolute after:w-full after:h-px after:bg-primary after:bottom-0 after:right-0 after:translate-x-full hover:after:translate-x-0";

  if (isExternal) {
    // External: Use <a> with target/rel
    return (
      <a
        href={href}
        target={link.target || "_self"}
        rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
        className={`${baseClasses} ${className}`}
      >
        {linkText}
      </a>
    );
  }

  // Internal: Use <Link> for SPA
  return (
    <Link href={href} className={`${baseClasses} ${className}`}>
      {linkText}
    </Link>
  );
};

export default LinkRenderer;
export type { LinkRendererProps };
