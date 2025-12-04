"use client";

import { useEffect, useState } from "react";
import Button from "../common/Button";
import { SIGNUP_FORM_ID, UMBRACO_FORM_GET } from "@/app/config/umbraco";
import { SubmitForms } from "@/app/service/UmbracoForm/Form";
import { jwtDecode } from "jwt-decode";

interface Props {
  formId: string;
  sessionId: string;
  resetTrigger?: any;
}

export default function SessionSignUpForm({
  formId,
  resetTrigger,
  sessionId,
}: Props) {
  const [form, setForm] = useState<any | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserID] = useState<string>();

  const errorInputClass =
    "border border-red-600 placeholder-red-400 ring-1 ring-red-600 focus:ring-red-600 focus:border-red-600";

  const normalInputClass =
    "border border-transparent focus:ring-2 focus:ring-[var(--dark-blue-color)] focus:border-[var(--dark-blue-color)]";

  const ErrorMessage = ({ msg }: { msg: string }) => (
    <p className="text-red-700 text-sm mt-1 ml-2 font-medium">{msg}</p>
  );

  // Load form definition
  useEffect(() => {
    if (!formId) return;

    fetch(`${UMBRACO_FORM_GET}${formId}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Error loading form:", err));
  }, [formId]);

  // Reset when switching categories
  useEffect(() => {
    setValues({});
    setErrors({});
    setSuccessMessage(null);
  }, [resetTrigger]);

  const handleChange = (alias: string, value: string) => {
    setValues((prev) => ({ ...prev, [alias]: value }));
  };

  // Decode user ID from JWT cookie
  useEffect(() => {
    fetch("/api/set-cookie", { cache: "no-store" })
      .then((res) => res.json())
      .then(({ token }) => {
        if (token) {
          const decoded: any = jwtDecode(token);
          setUserID(
            decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ]
          );
        }
      });
  }, []);

  // Validation function
  const validate = () => {
    let validationErrors: Record<string, string> = {};

    form?.pages.forEach((page: any) =>
      page.fieldSets.forEach((fs: any) =>
        fs.containers.forEach((col: any) =>
          col.fields.forEach((field: any) => {
            const val = values[field.alias];

            if (field.required && !val) {
              validationErrors[field.alias] =
                field.requiredErrorMessage ||
                `${field.caption} is required`;
            }

            if (field.pattern) {
              const regex = new RegExp(field.pattern);
              if (val && !regex.test(val)) {
                validationErrors[field.alias] =
                  field.patternInvalidErrorMessage || "Invalid value";
              }
            }
          })
        )
      )
    );

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      console.log("formid", formId)
      const result = await SubmitForms(form?.id, values);

      if (result.success) {
        setSuccessMessage("Thank you! Your signup is complete.");

        const date = new Date().toISOString();

        // 2nd form submission
        await SubmitForms(`${SIGNUP_FORM_ID}`, {
          userId,
          date,
          formId,
          sessionId,
        });

        setValues({});
        setErrors({});
      } else {
        setSuccessMessage(result.message || "Submission failed.");
      }
    } catch (err: any) {
      setSuccessMessage(err.message);
    }
  };

  if (successMessage) {
    return (
      <div className="bg-gradient-to-br from-[#FCB447] to-[#FF8526] rounded-b-2xl p-8 text-center">
        <div dangerouslySetInnerHTML={{ __html: successMessage }} />
      </div>
    );
  }

  if (!form) return <p>Loading form…</p>;

  return (
    <form
      className="bg-gradient-to-br from-[#FCB447] to-[#FF8526] rounded-b-2xl shadow-xl p-6 sm:p-8 md:p-10 w-full"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* <h2 className="text-2xl font-bold text-[var(--blue-color)] mb-6 text-center">
        {form.name}
      </h2> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {form.pages.map((page: any) =>
          page.fieldSets.map((fs: any) =>
            fs.containers.map((container: any) =>
              container.fields.map((field: any, index: number) => {
                const isPassword =
                  index === container.fields.length - 1 &&
                  field.alias.toLowerCase().includes("password");

                const label = (
                  <label className="block text-sm font-semibold text-[var(--blue-color)] mb-2 ml-2">
                    {field.caption}
                    {field.required && (
                      <span className="text-[var(--red-color)]">*</span>
                    )}
                  </label>
                );

                return (
                  <div key={field.alias}>
                    {label}
                    <input
                      type={isPassword ? "password" : "text"}
                      placeholder={field.settings?.placeholder || ""}
                      className={`w-full rounded-full px-4 py-3 bg-white ${errors[field.alias]
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
              })
            )
          )
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="dark-blue" className="w-48" type="submit">
          {form.submitLabel}
        </Button>
      </div>
    </form>
  );
}
