"use client";

import Button from "../../components/common/Button";
import { FiArrowRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ContentRendererProps } from "@/app/types";
import { ProfileSectionProps } from "@/app/types/home/ProfileSectionProps";
import { jwtDecode } from "jwt-decode";

const ProfileSection = ({ content }: ContentRendererProps) => {
  const {
    greetingText,
    statusMessage,
    viewAccount,
    informationalSubHeadline,
    buttons,
    viewAccounturl,
  } = content.properties as ProfileSectionProps;

  const [firstName, setFirstName] = useState();

  // ⭐ Use first object in viewAccounturl array
  const viewAccountLink = Array.isArray(viewAccounturl)
    ? viewAccounturl[0]
    : null;

  useEffect(() => {
    fetch("/api/set-cookie", { cache: "no-store" })
      .then((res) => res.json())
      .then(({ token }) => {
        if (token) {
          const decoded: any = jwtDecode(token);
          setFirstName(decoded.firstName);
        }
      });
  }, []);

  return (
    <section className="relative w-full px-[15px] md:px-[135px] md:py-[50px] py-10">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div
          className="w-full max-w-4xl rounded-2xl shadow-lg px-5 py-[30px] md:px-25 md:py-[70px] bg-[linear-gradient(134.33deg,#FCB447_30%,#FF8526_100%)]"
        >
          {/* Greeting */}
          <h2 className="heading-2 text-center mb-4 text-dark-blue">
            {greetingText} {firstName}
          </h2>

          {/* Status */}
          <p className="text-xl md:text-2xl font-bold text-center mb-4 text-dark-blue">
            {statusMessage}
          </p>

          {/* ⭐ DYNAMIC VIEW ACCOUNT LINK (using first array item) ⭐ */}
          <Link
            href={viewAccountLink?.route?.path || viewAccountLink?.url || "#"}
            target={viewAccountLink?.target || "_self"}
            className="flex items-center justify-center text-blue font-bold mb-4 gap-2"
          >
            {viewAccount}
            <span className="text-sm md:text-md text-white px-1 py-1 rounded-full bg-dark-blue">
              <FiArrowRight className="text-xl" />
            </span>
          </Link>

          {/* Info Text */}
          <p className="body-text text-blue leading-relaxed mb-6 md:mb-10 text-center mx-auto">
            {informationalSubHeadline}
          </p>

          {/* ⭐ Dynamic Buttons Loop ⭐ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {buttons?.map((btn, index) => (
              <Link
                key={index}
                href={btn.route?.path || btn.url || "#"}
                target={btn.target || "_self"}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="dark-blue"
                  className="whitespace-nowrap w-full sm:w-auto !px-[30px] !py-[5px] !text-center"
                >
                  {btn.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
