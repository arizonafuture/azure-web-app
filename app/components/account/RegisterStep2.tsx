"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { step2Schema } from "../../lib/validationSchemas";
import { useRegister } from "../../contexts/RegisterContext";
import Dropdown from "../common/Dropdown";
import { registerApi } from "@/app/service/account/MyAccount";
import MultiSelectDropdown from "../common/MultiSelectDropdown";

interface Step2FormFields {
  title: string;
  mediaBeat?: string;
  cellPhone: string;
  workPhone: string;
  linkedIn?: string;
  biography: string;
  categories: string[];
  yearInMedia: string;
  yearInArizona: string;
  receiveCommunications: boolean;
}

export default function Step2Form({ onBack, onSubmit, outerPadding,
  formPadding, }: any) {
  const { formData, updateForm, resetForm } = useRegister();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formData.categories || []
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const [finalData, setFinalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const categoryOptions = [
    { label: "Education", value: "Education" },
    { label: "Health", value: "Health" },
    { label: "Science", value: "Science" },
    { label: "Technology", value: "Technology" },
    { label: "Business", value: "Business" },
    { label: "Entertainment", value: "Entertainment" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Step2FormFields>({
    resolver: yupResolver(step2Schema) as any,
    defaultValues: formData,
  });

  // Sync multi-select with RHF
  useEffect(() => {
    setValue("categories", selectedCategories);
  }, [selectedCategories, setValue]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const submitStep = (data: any) => {
    const merged = { ...formData, ...data };
    updateForm(data);
    setFinalData(merged);
  };

  // API submit
  useEffect(() => {
    if (!finalData) return;
    const sendToApi = async () => {
      setLoading(true);
      try {
        const result = await registerApi(finalData);
        if (result.success) {
          resetForm();
          onSubmit();
        }
      } catch (err: any) {
        setServerError(err.message);
      }

      setLoading(false);
    };
    sendToApi();
  }, [finalData, onSubmit, resetForm]);

  return (
    <div className={outerPadding}>
      <div className="w-full flex justify-center relative">
        <form
          onSubmit={handleSubmit(submitStep)}
          className={`
            bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)]
            rounded-2xl shadow-lg
            w-full sm:w-[90%] md:w-[700px] lg:w-[850px]
            ${formPadding}
          `}
        >
          {/* PROGRESS BAR */}
          {/* Progress */}
          <div className="flex gap-5 mb-6 md:mb-7.5">
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-[var(--dark-blue-color)]"></div>
            <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
          </div>

          {/* -------------------- ROW 1 -------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* TITLE */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Title <span className="text-red-600">*</span>
              </label>

              <input
                {...register("title")}
                placeholder="Title"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.title
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* MEDIA BEAT (OPTIONAL) */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Media Beat
              </label>

              <input
                {...register("mediaBeat")}
                placeholder="Media Beat"
                className="w-full rounded-[50px] px-6 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
              />
            </div>
          </div>

          {/* -------------------- ROW 2 -------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* CELL PHONE */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Cell Phone <span className="text-red-600">*</span>
              </label>

              <input
                {...register("cellPhone")}
                placeholder="Cell Phone"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.cellPhone
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.cellPhone && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.cellPhone.message}
                </p>
              )}
            </div>

            {/* WORK PHONE */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Work Phone <span className="text-red-600">*</span>
              </label>

              <input
                {...register("workPhone")}
                placeholder="Work Phone"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.workPhone
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.workPhone && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.workPhone.message}
                </p>
              )}
            </div>
          </div>

          {/* -------------------- LINKEDIN -------------------- */}
          <div className="mb-6 md:mb-7.5">
            <label
              className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
            >
              LinkedIn
            </label>

            <input
              {...register("linkedIn")}
              placeholder="https://"
              className="w-full rounded-[50px] px-6 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
            />
          </div>

          {/* -------------------- ROW 4 -------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* BIOGRAPHY */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Biography or Published Work{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                {...register("biography")}
                placeholder="Biography or Published Work"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.biography
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.biography && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.biography.message}
                </p>
              )}
            </div>

            {/* MULTI SELECT CATEGORIES */}
            {/* Areas of Interest */}
            <div className="relative w-full">
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Areas of Interest <span className="text-red-600">*</span>
              </label>

              {/* Error Border */}
              <div className={`${errors.categories ? "border border-red-600 rounded-[50px]" : ""}`}>
                <MultiSelectDropdown
                  options={categoryOptions}
                  value={selectedCategories}
                  onChange={(newValues) => {
                    setSelectedCategories(newValues);

                    // Update formData to match API
                    updateForm({ categories: newValues });
                    setValue("categories", newValues);

                  }}
                  placeholder="Select Interest Categories"
                />
              </div>
            </div>

          </div>

          {/* -------------------- YEARS ROW -------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 md:mb-7.5">
            {/* YEAR IN MEDIA */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Year Began Working in Media{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                {...register("yearInMedia")}
                placeholder="YYYY"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.yearInMedia
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.yearInMedia && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.yearInMedia.message}
                </p>
              )}
            </div>

            {/* YEAR IN ARIZONA MEDIA */}
            <div>
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Year Started in Arizona Media{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                {...register("yearInArizona")}
                placeholder="YYYY"
                className={`w-full rounded-[50px] px-6 py-3 bg-white ${errors.yearInArizona
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.yearInArizona && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.yearInArizona.message}
                </p>
              )}
            </div>
          </div>

          {/* -------------------- CHECKBOX -------------------- */}
          <div className="flex items-start sm:items-center mb-6 md:mb-7.5 md:ml-10">
            <Controller
              control={control}
              name="receiveCommunications"
              defaultValue={true}
              render={({ field }) => {
                const checked = !!field.value;

                return (
                  <label className="flex items-center gap-3 cursor-pointer">
                    {/* Hidden checkbox */}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />

                    {/* Custom UI */}
                    <div
                      onClick={() => field.onChange(!checked)}
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center transition-all
                        ${checked
                          ? "bg-[var(--dark-blue-color)]"
                          : "bg-white border-2 border-[var(--dark-blue-color)]"
                        }
                      `}
                    >
                      {checked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="white"
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <span
                      className="body-text-large text-[#003960] !leading-[1.6]"
                    >
                      I wish to receive communications from the Arizona Media Institute.
                    </span>
                  </label>
                );
              }}
            />
          </div>

          {/* -------------------- SUBMIT -------------------- */}
          <div className="flex justify-center mb-6 md:mb-7.5 w-full">
            <button
              type="submit"
              className="w-full bg-[var(--dark-blue-color)] text-white py-3 rounded-full font-semibold"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          {serverError && (
            <p className="text-red-600 text-center mt-3 text-sm font-semibold">
              {serverError}
            </p>
          )}

          {/* DISCLAIMER */}
          <p className="body-text-small md:text-base text-start mb-6 md:mb-7.5 text-[var(--blue-color)] leading-relaxed">
            Access to expert resources is granted at the discretion of the Arizona Media Institute.
          </p>

          {/* FOOTER */}
          <div className="text-center">
            <span className="body-text-small text-sm md:text-base text-[var(--blue-color)]">
              Already have an account?{" "}
              <a href="/login" className="underline font-bold text-[var(--dark-blue-color)]">
                Log in
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
