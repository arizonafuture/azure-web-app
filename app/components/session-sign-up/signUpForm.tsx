"use client";

import { ContentRendererProps } from "@/app/types";
import SessionSignUpForm from "./SessionSignUpForm";
import { useSearchParams } from "next/navigation";

const SessionSignUpBlock = ({ content }: ContentRendererProps) => {
  const searchParams = useSearchParams();

  // ⭐ Read from URL
  const sessionId = searchParams.get("sessionId") || "";
  const formId = searchParams.get("formId") || "";

  if (!formId) {
    return (
      <section className="w-full py-16 flex justify-center">
        <p className="text-red-600 text-lg">Form ID missing in URL.</p>
      </section>
    );
  }

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        <h2
          className='
          text-3xl sm:text-4xl 
          font-bold 
          mb-6 
          text-[var(--blue-color)] 
          text-center 
          !font-["Times_New_Roman"]
        '
        >
          Sign Up
        </h2>

        {/* ⭐ Pass URL params to actual signup form */}
        <SessionSignUpForm formId={formId} sessionId={sessionId} />
      </div>
    </section>
  );
};

export default SessionSignUpBlock;
