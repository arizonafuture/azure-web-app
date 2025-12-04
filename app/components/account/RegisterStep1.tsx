"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step1Schema } from "../../lib/validationSchemas";
import { useRegister } from "../../contexts/RegisterContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import Button from "../common/Button";

export default function Step1Form({
  onNext,
  outerPadding,
  formPadding,
}: {
  onNext: () => void;
  outerPadding?: string;
  formPadding?: string;
}) {
  const { formData, updateForm } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(step1Schema) as any,
    defaultValues: formData,
  });

  useEffect(() => {
    Object.entries(formData).forEach(([key, value]) =>
      setValue(key as any, value)
    );
  }, []);

  const onSubmit = (data: any) => {
    updateForm(data);
    onNext();
  };

  // 🔥 Reusable style function (optional helper)
  const getInputClass = (hasError: boolean) =>
    `w-full rounded-[50px] px-6 py-3 bg-white ${
      hasError
        ? "border border-red-600 placeholder-red-400"
        : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
    }`;

  return (
    <div className={outerPadding}>
      <div className="w-full flex justify-center relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`
            bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)]
            rounded-2xl
            w-full sm:w-[90%] md:w-[700px] lg:w-[850px]
            ${formPadding}
          `}
        >
          {/* Progress Indicator */}
          <div className="flex gap-5 mb-6 md:mb-7.5">
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-[var(--dark-blue-color)]"></div>
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
          </div>

          {/* NAME FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* FIRST NAME */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                First Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register("firstName")}
                placeholder="First Name"
                className={getInputClass(!!errors.firstName)}
              />

              {errors.firstName && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Last Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register("lastName")}
                placeholder="Last Name"
                className={getInputClass(!!errors.lastName)}
              />

              {errors.lastName && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* EMAIL + MEDIA OUTLET */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* EMAIL */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Email Address <span className="text-red-500">*</span>
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className={getInputClass(!!errors.email)}
              />

              {errors.email && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* MEDIA OUTLET */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Media Outlet <span className="text-red-500">*</span>
              </label>

              <input
                {...register("mediaOutlet")}
                placeholder="Media Outlet"
                className={getInputClass(!!errors.mediaOutlet)}
              />

              {errors.mediaOutlet && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.mediaOutlet.message}
                </p>
              )}
            </div>
          </div>

          {/* PASSWORD + CONFIRM PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* PASSWORD */}
            <div className="relative">
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Password <span className="text-red-500">*</span>
              </label>

              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="********"
                className={`${getInputClass(!!errors.password)} pr-12`}
              />

              <button
                type="button"
                className="absolute right-4 top-[47px]"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-[var(--blue-color)]" />
                ) : (
                  <FaEye className="text-[var(--blue-color)]" />
                )}
              </button>

              {errors.password && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="********"
                className={`${getInputClass(!!errors.confirmPassword)} pr-12`}
              />

              <button
                type="button"
                className="absolute right-4 top-[47px]"
                onClick={() => setShowConfirmPassword((p) => !p)}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-[var(--blue-color)]" />
                ) : (
                  <FaEye className="text-[var(--blue-color)]" />
                )}
              </button>

              {errors.confirmPassword && (
                <p className="text-red-700 text-sm mt-1 ml-4">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* NEXT BUTTON */}
          <div className="mb-6 md:mb-7.5">
            <Button variant="dark-blue" type="submit" className="w-full">
              Next <FiArrowRight className="w-5 h-5 ml-4 inline" />
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="body-text-small text-sm md:text-base text-[var(--blue-color)] leading-relaxed mb-2 md:mb-7.5">
            Access to expert content is reserved for verified journalists and is
            granted at Arizona Media Institute’s discretion.
          </p>

          {/* Login Link */}
          <div className="text-center">
            <span className="body-text-small text-sm md:text-base text-[var(--blue-color)]">
              Already have an account?{" "}
              <a
                href="/login"
                className="body-text-small underline !font-bold text-[var(--dark-blue-color)]"
              >
                Log in
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
