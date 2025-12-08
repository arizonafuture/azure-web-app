"use client";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export default function MultiSelectDropdown({
    options,
    value,
    onChange,
    placeholder = "Select...",
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Toggle option
    const toggleValue = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    // Select All
    const toggleAll = () => {
        if (value.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map((o) => o.value));
        }
    };

    return (
        <div ref={ref} className="input-field-container flex-1 min-w-[200px] relative !border-none" style={{ zIndex: isOpen ? 100 : undefined }}>
            {/* Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="input-field-dropdown w-full appearance-none cursor-pointer pr-[50px] text-left flex items-center justify-between"
            >
                <span className="text-black">
                    {value.length > 0
                        ? options
                            .filter((opt) => value.includes(opt.value))
                            .map((opt) => opt.label)
                            .join(", ")
                        : placeholder}
                </span>

                <div className="absolute right-[25px] top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FiChevronDown className="text-dark-blue text-lg" />
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 bg-white rounded-lg z-50">
                    {/* Search Field */}
                    <input
                        type="text"
                        className="w-full px-3 py-2 mb-2 border rounded-lg border-3 border-gray-400 focus:outline-none"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Options List */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {/* Select All */}
                        <label className="flex items-center gap-2 px-2 py-2 hover:bg-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value.length === options.length}
                                onChange={toggleAll}
                                className="w-4 h-4 cursor-pointer rounded-sm checked:border-blue-600"
                            />
                            All
                        </label>

                        {/* Items */}
                        {filteredOptions.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-300 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={value.includes(opt.value)}
                                    onChange={() => toggleValue(opt.value)}
                                    className="w-4 h-4 cursor-pointer rounded-sm checked:border-blue-600"
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

