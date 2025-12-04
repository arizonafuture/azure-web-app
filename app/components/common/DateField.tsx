"use client";
import { HTMLInputTypeAttribute, useState, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

interface DateFieldProps {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const DateField = ({
  type,
  placeholder,
  value: externalValue,
  onChange,
}: DateFieldProps) => {
  const [internalValue, setInternalValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const value = externalValue !== undefined ? externalValue : internalValue;
  const isControlled = externalValue !== undefined;

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString + "T00:00:00");

      if (isNaN(date.getTime())) return dateString;

      if (type === "month") {
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } else {
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };

  const displayValue = formatDateForDisplay(value);
  const hasValue = !!value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClick = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  // Restrict month selection to today → next 30 days
  const getMinValue = () => {
    const today = new Date();
    return type === "month"
      ? today.toISOString().slice(0, 7)
      : today.toISOString().split("T")[0];
  };

  const getMaxValue = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return type === "month"
      ? maxDate.toISOString().slice(0, 7)
      : maxDate.toISOString().split("T")[0];
  };

  return (
    <div
      className="input-field-container flex-1 min-w-[200px] relative cursor-pointer"
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        min={getMinValue()}
        max={getMaxValue()}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        style={{
          width: "100%",
          height: "100%",
          colorScheme: "light",
        }}
      />

      <div
        className={`input-field input-field-normal ${hasValue ? "input-field-date" : "date-field-placeholder"
          } w-full pr-[50px] pointer-events-none`}
      >
        {hasValue ? (
          <span className="text-dark-blue body-text">{displayValue}</span>
        ) : (
          <span className="text-blue body-text">{placeholder}</span>
        )}
      </div>

      <div className="absolute right-[25px] top-1/2 transform -translate-y-1/2 pointer-events-none z-0">
        <FaCalendarAlt className="text-blue text-lg" />
      </div>
    </div>
  );
};

export default DateField;
