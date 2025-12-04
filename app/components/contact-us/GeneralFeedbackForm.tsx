"use client";

import { useEffect, useState } from "react";
import Button from "../common/Button";
import { UMBRACO_FORM_GET, UMBRACO_FORM_POST } from "@/app/config/umbraco";
import { SubmitForms } from "@/app/service/UmbracoForm/Form";
import SuccessFeedback from "./SuccessFeedback";

export default function GeneralFeedbackForm({ formId, resetTrigger }: any) {
  const [form, setForm] = useState<any | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitSuccess, setSubmitSuccess] = useState<boolean | null>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("");
  const errorInputClass =
    "border border-[var(--red-color)] placeholder-[var(--red-color)]";

  const normalInputClass =
    "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]";

  const ErrorMessage = ({ msg }: { msg: string }) => (
    <p className="text-red-700 text-sm mt-1 ml-2 font-medium">{msg}</p>
  );

  // Fetch form definition
  useEffect(() => {
    if (!formId) return;

    fetch(`${UMBRACO_FORM_GET}${formId}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Error loading form:", err));
  }, [formId]);

  useEffect(() => {
    setValues({});
    setErrors({});
    setSuccessMessage(null);
  }, [resetTrigger]);

  const handleChange = (alias: string, value: string) => {
    setValues((prev) => ({ ...prev, [alias]: value }));
  };

  const validate = () => {
    let newErrors: Record<string, string> = {};

    form?.pages.forEach((page: any) =>
      page.fieldSets.forEach((fs: any) =>
        fs.containers.forEach((container: any) =>
          container.fields.forEach((field: any) => {
            const val = values[field.alias];

            if (field.mandatory && !val) {
              newErrors[field.alias] =
                field.requiredErrorMessage || `${field.caption} is required`;
            }

            if (field.regex) {
              const regex = new RegExp(field.regex);
              if (val && !regex.test(val)) {
                newErrors[field.alias] =
                  field.invalidErrorMessage || "Invalid input";
              }
            }
          })
        )
      )
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ❗ FIXED POST URL HERE ONLY (EVERYTHING ELSE UNCHANGED)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await SubmitForms(formId, values);

      if (result.success) {
        setSubmitSuccess(true);
        setValues({});
        setErrors({});
      } else {
        setSuccessMessage(result.message || "Failed to submit.");
      }
    } catch (error: any) {
      setSuccessMessage(error.message);
    }
  };

  useEffect(() => {
    if (isSubmitSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitSuccess]);

  if (isSubmitSuccess) {
    return (
      <div className="bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)] rounded-b-xl p-0 sm:p-8 md:p-12.5 w-full">
        <SuccessFeedback />
      </div>
    );
  }

  if (!form) return <p className="py-10 px-10">Loading General Feedback Form...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="sm:p-8 md:p-12.5 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-5 md:gap-y-7.5 md:mb-7.5">
        {form.pages.map((page: any) =>
          page.fieldSets.map((fs: any) =>
            fs.containers.map((container: any) =>
              container.fields.map((field: any) => {
                const label = (
                  <label className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]">
                    {field.caption}
                    {field.mandatory && (
                      <span className="text-[var(--red-color)] ml-1">*</span>
                    )}
                  </label>
                );

                const inputFieldType = field.settings?.FieldType;

                if (inputFieldType === "datetime-local") {
                  return (
                    <div key={field.alias}>
                      {label}
                      <input
                        type="time"
                        className={`body-text w-full rounded-[50px] px-6 py-3 !leading-[1.6] bg-white ${
                          errors[field.alias]
                            ? errorInputClass
                            : normalInputClass
                        }`}
                        value={values[field.alias] || ""}
                        onChange={(e) =>
                          handleChange(field.alias, e.target.value)
                        }
                      />
                      {errors[field.alias] && (
                        <ErrorMessage msg={errors[field.alias]} />
                      )}
                    </div>
                  );
                }

                if (inputFieldType === "text") {
                  return (
                    <div key={field.alias} className="md:col-span-2">
                      {label}
                      <textarea
                        rows={4}
                        placeholder={field.settings?.Placeholder || ""}
                        className={`body-text w-full rounded-[26px] px-6 py-3 !leading-[1.6] bg-white ${
                          errors[field.alias]
                            ? errorInputClass
                            : normalInputClass
                        }`}
                        value={values[field.alias] || ""}
                        onChange={(e) =>
                          handleChange(field.alias, e.target.value)
                        }
                      />
                      {errors[field.alias] && (
                        <ErrorMessage msg={errors[field.alias]} />
                      )}
                    </div>
                  );
                }

                return (
                  <div key={field.alias}>
                    {label}
                    <input
                      type="text"
                      placeholder={field.settings?.Placeholder || ""}
                      className={`body-text w-full rounded-[50px] px-6 py-3 !leading-[1.6] bg-white ${
                        errors[field.alias] ? errorInputClass : normalInputClass
                      }`}
                      value={values[field.alias] || ""}
                      onChange={(e) =>
                        handleChange(field.alias, e.target.value)
                      }
                    />
                    {errors[field.alias] && (
                      <ErrorMessage msg={errors[field.alias]} />
                    )}
                  </div>
                );
              })
            )
          )
        )}
      </div>

      <div className="flex justify-center mt-6 md:mt-0">
        <Button variant="dark-blue" className="!px-7.5 !py-4" type="submit">
          {form.submitLabel || "Submit"}
        </Button>
      </div>
    </form>
  );
}
