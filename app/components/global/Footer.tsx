"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import {
  FORMS_API_BASE_URL,
  UMBRACO_FORM_GET,
  UMBRACO_FORM_POST,
  UPLOAD_RESUME_API_URL,
} from "../../config/umbraco";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { LinkItem, MediaItem } from "@/app/types";
import { SocialMediaLink } from "@/app/types/headerfooter";
import { SubmitForms } from "@/app/service/UmbracoForm/Form";

export type FormField = {
  alias: string;
  caption: string;
  fieldType: string;
  settings?: any;
  preValues?: { value: string; caption: string }[];
  type: { name: string };
};

interface FooterProps {
  newslettterSection: string;
  subHeading: string;
  formSelection?: {
    formId?: string;
    theme?: string | null;
    redirectToPageId?: string | null;
    form?: any;
  };
  submitButton?: string;
  whiteLogo?: string;
  siteUrl?: string;
  usefulLinkTitle?: string;
  links?: SocialMediaLink[];
  socialMediaLinks?: SocialMediaLink[];
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  newslettterSection,
  subHeading,
  formSelection,
  submitButton,
  whiteLogo,
  siteUrl,
  usefulLinkTitle,
  links,
  socialMediaLinks,
  copyrightText,
}) => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [fileUploading, setFileUploading] = useState(false);

  const formId = formSelection?.formId;

  // Fetch CSRF + Form definition
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);

        // Form definition
        const res = await fetch(`${UMBRACO_FORM_GET}${formId}`);
        if (!res.ok) throw new Error("Failed to fetch form definition");
        const data = await res.json();

        const allFields: FormField[] = data.pages.flatMap((page: any) =>
          page.fieldSets.flatMap((fs: any) =>
            fs.containers.flatMap((col: any) => col.fields)
          )
        );

        setFields(allFields);
      } catch (err) {
        console.error(" Form fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) fetchForm();
  }, [formId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "checkbox") {
      const prev = formData[name] || [];
      setFormData({
        ...formData,
        [name]: checked
          ? [...prev, value]
          : prev.filter((v: string) => v !== value),
      });
    } else if (type === "file" && files?.length) {
      uploadFile(files[0], name);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Upload file to Umbraco Media
  const uploadFile = async (file: File, fieldAlias: string) => {
    try {
      setFileUploading(true);
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = { FileName: file.name, FileData: base64 };

      const res = await fetch(UPLOAD_RESUME_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("File upload failed");
      const result = await res.json();

      setFormData((prev) => ({
        ...prev,
        [fieldAlias]: result.url,
        filePathName: result.url,
      }));
    } catch (err) {
      console.error("File upload error:", err);
    } finally {
      setFileUploading(false);
    }
  };

  // Submit form to Umbraco
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setSubmitMessage("");
      setSubmitSuccess(null);
      // Exclude file fields (already uploaded), include hidden filePathName
      const payloadValues = Object.fromEntries(
        Object.entries(formData).filter(([key]) => {
          const field = fields.find((f) => f.alias === key);
          console.log(field);
          return field?.alias !== "File upload";
        })
      );

      //const payload = { values: payloadValues };
      const result = await SubmitForms(formId, payloadValues);
      if (result.success) {
        setSubmitSuccess(true);
        setSubmitMessage(result.message || "Form submitted successfully!");
        setFormData({});
      } else {
        throw new Error(result.message || "Form submission failed.");
      }
    } catch (err: any) {
      setSubmitSuccess(false);
      setSubmitMessage(err.message || "Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const footerLogo = whiteLogo ? buildMediaUrl(whiteLogo) : "";

  const normalizedSocialLinks = Array.isArray(socialMediaLinks)
    ? socialMediaLinks.map((link) => ({
        title: link.name?.toLowerCase().replace(".com", "").trim() || "",
        href: link.url || "#",
      }))
    : [];

  return (
    <footer
      className="text-white w-full flex flex-col items-center px-5 lg:px-[70px] md:pt-20 py-10"
      style={{
        background:
          "linear-gradient(0deg, #18254E, #18254E), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
      }}
    >
      <div className="w-full max-w-[1440px] px-0 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-[30px] border-b border-gray-400 pb-8 md:pb-[30px]">
          {/* Left Column */}
          <div className="flex flex-col md:col-span-4">
            <div className="flex items-center gap-4 mb-4">
              {footerLogo && (
                <img
                  src={footerLogo}
                  alt="Logo"
                  className="h-12 sm:h-16 md:h-[82px] w-auto mb-2"
                />
              )}
            </div>

            {subHeading && (
              <p className="text-sm text-white mb-2">{subHeading}</p>
            )}
            {typeof siteUrl === "string" && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline text-sm hover:text-gray-300 transition-colors"
              >
                {siteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>

          {/* Middle Column */}
          <div className="flex flex-col md:col-span-3">
            {usefulLinkTitle && (
              <h3 className="subhead sm:text-lg !font-bold mb-3 md:mb-3">
                {usefulLinkTitle}
              </h3>
            )}
            <ul className="grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-2 text-sm">
              {links?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url || "#"}
                    className="text-lighter-blue body-text-small hover:text-gray-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Umbraco Form */}
          {/* Right Column - Umbraco Form (Newsletter + Social Links) */}
          <div className="flex flex-col md:col-span-5">
            {/* Dynamic Heading */}
            {newslettterSection && (
              <h3 className="text-base sm:text-lg font-bold mb-3 md:mb-[14px]">
                {newslettterSection}
              </h3>
            )}

            {/* Newsletter Form */}
            {submitSuccess !== null ? (
                  <div className="bg-white/10 backdrop-blur-md p-5 rounded-[10px] max-w-[420px] text-center mb-6">
                  <h4 className="text-white heading-5 mb-2">
                    Thank You!
                  </h4>
                  <p className="text-white body-text-small !leading-[1.5]">
                    The form has been submitted successfully.
                    <br /> We will reply to you soon.
                  </p>
                </div>
                  ):(
            isLoading ? (
              <p className="text-gray-300">Loading form...</p>
            ) : (
              <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
                <div className="relative w-full max-w-[492px] h-[50px] sm:h-[57px]">
                  {/* Single Email Field (or first field if multiple) */}
                  {fields.map((field) => {
                    const { alias, caption, type } = field;
                    if (
                      type?.name?.toLowerCase() === "email" ||
                      alias.includes("email")
                    ) {
                      return (
                        <input
                          key={alias}
                          type="email"
                          name={alias}
                          placeholder={caption || "Email Address"}
                          value={formData[alias] || ""}
                          onChange={handleChange}
                          className="bg-white text-gray-800 placeholder-[#6A6E8C] focus:outline-none w-full h-full"
                          style={{
                            paddingTop: "5px",
                            paddingRight: "110px",
                            paddingBottom: "5px",
                            paddingLeft: "20px",
                            borderTopWidth: "1px",
                            borderBottomWidth: "1px",
                            borderLeftWidth: "1px",
                            borderRightWidth: "0px",
                            borderStyle: "solid",
                            borderColor: "#000",
                            borderRadius: "60px",
                            fontSize: "18px",
                          }}
                          required
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || fileUploading}
                    className="absolute font-bold whitespace-nowrap focus:outline-none transition-opacity hover:opacity-90 text-[#18254E] flex items-center justify-center"
                    style={{
                      right: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "100px",
                      height: "40px",
                      paddingRight: "30px",
                      paddingLeft: "30px",
                      paddingTop: "14px",
                      paddingBottom: "14px",
                      borderRadius: "45px",
                      background:
                        "linear-gradient(90deg, #F97C1A 0%, #FCB447 100%)",
                      border: "none",
                      fontSize: "16px",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            ))}

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 md:gap-6.5">
              {normalizedSocialLinks.map((social, i) => {
                const title = social.title.toLowerCase();
                const Icon = title.includes("facebook")
                  ? FaFacebookF
                  : title.includes("twitter")
                  ? FaXTwitter
                  : title.includes("instagram")
                  ? FaInstagram
                  : title.includes("linkedin")
                  ? FaLinkedinIn
                  : null;

                return (
                  Icon && (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lighter-blue hover:text-gray-300 transition-colors"
                      aria-label={social.title}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center w-full">
        <p className="body-text-small sm:text-sm text-lighter-blue pt-[30px]">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
