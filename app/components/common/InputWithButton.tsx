import { ReactNode } from "react";

interface InputWithButtonProps {
  type: HTMLInputElement["type"];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  leftIcon?: ReactNode;
  className?: string;
}
const InputWithButton = ({
  type,
  value,
  onChange,
  placeholder,
  buttonText,
  buttonIcon,
  leftIcon,
  className,
}: InputWithButtonProps) => {
  const hasIcon = !!buttonIcon;
  const hasLeftIcon = !!leftIcon;
  const buttonWidth = hasIcon ? "42px" : "100px";
  const buttonHeight = hasIcon ? "42px" : "40px";
  const buttonBorderRadius = hasIcon ? "100px" : "45px";
  const inputPaddingRight = hasIcon ? "52px" : "110px";
  const inputPaddingLeft = hasLeftIcon ? "48px" : "20px";

  return (
    <div className={`relative h-[50px] w-full ${className}`}>
      {hasLeftIcon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl z-10">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-white text-gray-800 placeholder-[#6A6E8C] focus:outline-none w-full h-full"
        style={{
          paddingTop: "5px",
          paddingRight: inputPaddingRight,
          paddingBottom: "5px",
          paddingLeft: inputPaddingLeft,
          borderTopWidth: "1px",
          borderBottomWidth: "1px",
          borderLeftWidth: "1px",
          borderRightWidth: "0px",
          borderStyle: "solid",
          borderColor: "#000",
          borderRadius: "60px",
          fontSize: "14px",
        }}
        required
      />
      <button
        type="button"
        className="text-blue absolute font-bold whitespace-nowrap !py-[14px] focus:outline-none transition-opacity hover:opacity-90 flex items-center justify-center"
        style={{
          right: "5px",
          top: "50%",
          transform: "translateY(-50%)",
          width: buttonWidth,
          height: buttonHeight,
          paddingRight: hasIcon ? "0" : "24px",
          paddingLeft: hasIcon ? "0" : "24px",
          borderRadius: buttonBorderRadius,
          background: "linear-gradient(90deg, #F97C1A 0%, #FCB447 100%)",
          border: "none",
          fontSize: "14px",
        }}
      >
        {buttonIcon || buttonText}
      </button>
    </div>
  );
};

export default InputWithButton;
