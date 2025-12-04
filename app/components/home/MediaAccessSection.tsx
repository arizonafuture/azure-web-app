"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Button from "../../components/common/Button";
import Link from "next/link";
import RegisterForm from "../account/RegisterUser";
import { ContentRendererProps, LinkItem } from "@/app/types";
import { Mediaaccessprops } from "@/app/types/home/Mediaaccessprops";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
}

const MediaAccessSection: React.FC<ContentRendererProps> = ({ content }) => {
  const { headline, subheadline, button } =
    content.properties as Mediaaccessprops;
  console.log("button", button);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <section
      className="relative bg-[var(--lighter-orange-color)] w-full px-[15px] md:px-[40px] lg:px-[80px] xl:px-[135px] py-10 md:py-15"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[70px]">
          {/* LEFT SIDE — TEXT + CTA BUTTONS */}
          <div className="w-full lg:w-[35%] xl:w-2/5 flex flex-col justify-center">
            <h2 className="heading-2 md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-[var(--dark-blue-color)]">
              {headline}
            </h2>

            <p
              className="body-text-large md:text-lg mb-8 text-[var(--blue-color)] leading-relaxed !leading-[1.6]"
            >
              {subheadline}
            </p>

            {/* ⭐ DYNAMIC BUTTON LOOP ⭐ */}
            <div className="flex flex-col gap-4 mt-4 items-center lg:items-start">
              {button?.map((btn: LinkItem, index: number) => (
                <Link
                  key={index}
                  href={btn.route?.path || btn.url || "#"}
                  target={btn.target || "_self"}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="dark-blue"
                    showArrow={true}
                    className="border border-white px-6 py-3"
                  >
                    {btn.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — REGISTER FORM */}
          <div className="w-full lg:w-[65%] xl:w-3/5">
            <RegisterForm
              outerPadding="none"
              formPadding="px-[30px] py-[40px]"
              offset={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaAccessSection;
