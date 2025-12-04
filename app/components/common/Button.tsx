"use client";
import { FaArrowRight } from "react-icons/fa6";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "orange" | "dark-blue" | "light-blue" | "transparent" | "white" | "gray";
  showArrow?: boolean;
  children: ReactNode;
  className?: string;
}

const Button = ({
  variant = "orange",
  showArrow = false,
  children,
  className = "",
  onClick,
  ...props
}: ButtonProps) => {
  // Determine button classes based on variant and arrow
  const getButtonClass = (): string => {
    const baseClass = "btn";
    if (showArrow) {
      switch (variant) {
        case "orange":
          return `${baseClass} btn-orange-arrow gap-5`;
        case "dark-blue":
          return `${baseClass} btn-dark-blue-arrow gap-5`;
        case "light-blue":
          return `${baseClass} btn-light-blue-arrow gap-5`;
        case "transparent":
          return `${baseClass} btn-transparent-arrow gap-5`;
        case "white":
          return `${baseClass} btn-white-arrow gap-5`;
        case "gray":
          return `${baseClass} btn-gray-arrow gap-5`;
        default:
          return `${baseClass} btn-orange-arrow gap-5`;
      }
    } else {
      switch (variant) {
        case "orange":
          return `${baseClass} btn-orange`;
        case "dark-blue":
          return `${baseClass} btn-dark-blue`;
        case "light-blue":
          return `${baseClass} btn-light-blue`;
        case "transparent":
          return `${baseClass} btn-transparent-btn`;
        case "white":
          return `${baseClass} btn-white`;
        case "gray":
          return `${baseClass} btn-gray`;
        default:
          return `${baseClass} btn-orange`;
      }
    }
  };

  // Get icon container background color
  const getIconBgColor = (): string | null => {
    if (!showArrow) return null;

    switch (variant) {
      case "orange":
        return "#ffffff";
      case "dark-blue":
        return "white";
      case "light-blue":
        return "#18254E";
      case "transparent":
        return "#18254E";
      case "white":
        return "#510C51";
      case "gray":
        return "#18254E";
      default:
        return "#18254E";
    }
  };

  // Get icon color
  const getIconColor = (): string | null => {
    if (!showArrow) return null;

    switch (variant) {
      case "orange":
        return "dark-blue";
      case "dark-blue":
        return "#18254E";
      case "light-blue":
        return "white";
      case "transparent":
        return "#ffffff";
      case "white":
        return "white";
      case "gray":
        return "#18254E";
      default:
        return "white";
    }
  };

  return (
    <button
      className={`${getButtonClass()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
      {showArrow && (
        <span
          className="btn-icon"
          style={{ backgroundColor: getIconBgColor() || undefined }}
        >
          <FaArrowRight
            style={{
              color: getIconColor() || undefined,
              fontSize: "22px",
            }}
          />
        </span>
      )}
    </button>
  );
};

export default Button;
