"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  className?: string;
}

const Dropdown = ({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div
      className={`input-field-container flex-1 min-w-[200px] relative ${className}`}
      ref={dropdownRef}
      style={{ zIndex: isOpen ? 100 : undefined }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field-dropdown w-full appearance-none cursor-pointer pr-[50px] text-left flex items-center justify-between"
        style={{
          borderBottomLeftRadius: isOpen ? 0 : undefined,
          borderBottomRightRadius: isOpen ? 0 : undefined,
          transition: "border-radius 0s ease-in-out",
          outline: "none",
          border: "1px solid transparent",
        }}
      >
        <span className="text-blue body-text hover:opacity-[0.6]">{displayText}</span>
        <div className="absolute right-[25px] top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="text-dark-blue text-lg" />
        </div>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-menu-item ${
                value === option.value ? "dropdown-menu-item-selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
