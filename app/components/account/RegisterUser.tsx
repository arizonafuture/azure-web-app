"use client";
import { useState } from "react";
import Step1Form from "./RegisterStep1";
import Step2Form from "./RegisterStep2";
import { useRegister } from "../../contexts/RegisterContext";
import ThanksScreen from "./ThanksScreen";
import Button from "../common/Button";

export default function RegisterForm({
  outerPadding = "pb-10 md:pb-20 px-4 md:px-58.5",
  formPadding = "py-7.5 px-4 sm:p-8 md:p-12.5",
  offset = true,
}) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <ThanksScreen />;
  }

  return (
    <div className={offset ? "-mt-45" : ""}>
      {/* STEP 1 */}
      {step === 1 && (
        <Step1Form
          onNext={() => setStep(2)}
          outerPadding={outerPadding}
          formPadding={formPadding}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Step2Form
          onBack={() => setStep(1)}
          onSubmit={() => setSubmitted(true)}
          outerPadding={outerPadding}
          formPadding={formPadding}
        />
      )}

      {/* THANK YOU SCREEN */}
      {submitted &&
      <div className="w-full pt-32 pb-24 flex justify-center relative">
        <div className={offset ? "-mt-70" : ""}>{submitted && <ThanksScreen />}</div>
      </div>
}
    </div>
  );
}
