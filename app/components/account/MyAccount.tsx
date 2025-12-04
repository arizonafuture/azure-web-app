"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { FaPencil } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Dropdown from "../common/Dropdown";
import Button from "../../components/common/Button";
import MultiSelectDropdown from "../common/MultiSelectDropdown";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  deleteAuthCookie,
  setAuthCookie,
} from "@/app/server/authCookies";
import { updateProfileWithPasswordApi } from "@/app/service/account/MyAccount";
import AuthPageHeader from "../common/AuthPageHeader";
import { myAccountSchema } from "@/app/lib/validationSchemas";

/* ---------------------------------------------
   JWT Payload Interface
--------------------------------------------- */
interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mediaOutlet: string;
  workPhone: string;
  cellPhone: string;
  linkedIn: string;
  biography: string;
  title: string;
  mediaBeat: string;
  categories: string;
  yearInMedia: string;
  yearInArizona: string;
  receiveCommunications: string;
}

export default function MyAccountPage() {
  const router = useRouter();

  /* ---------------------------------------------
     STATE
  --------------------------------------------- */
  const [token, setToken] = useState<string>();
  const [profile, setProfile] = useState<JwtPayload | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(
    ""
  );

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const [formData, setFormData] = useState<any>({
    id: "",
    firstName: "",
    lastName: "",
    workemail: "",
    mediaOutlet: "",
    title: "",
    cellPhone: "",
    workPhone: "",
    linkedIn: "",
    interestCategories: [],
    publishedLink: "",
    receiveComm: false,
    yearStarted: "",
    yearBegan: "",
  });

  /* ---------------------------------------------
     React Hook Form
  --------------------------------------------- */
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(myAccountSchema),
    defaultValues: formData,
  });

  /* ---------------------------------------------
     Load JWT + Map to Form
  --------------------------------------------- */
  useEffect(() => {
    fetch("/api/set-cookie", { cache: "no-store" })
      .then((res) => res.json())
      .then(({ token }) => {
        if (!token) {
          router.push("/login");
          return;
        }
        setToken(token);

        const decoded: any = jwtDecode(token);

        const mapped: JwtPayload = {
          id:
            decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ],
          firstName: decoded.firstName || "",
          lastName: decoded.lastName || "",
          email:
            decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ] || "",
          mediaOutlet: decoded.mediaOutlet || "",
          workPhone: decoded.workPhone || "",
          cellPhone: decoded.cellPhone || "",
          linkedIn: decoded.linkedIn || "",
          biography: decoded.biography || "",
          title: decoded.title || "",
          mediaBeat: decoded.mediaBeat || "",
          categories: decoded.categories || "",
          yearInMedia: decoded.yearInMedia || "",
          yearInArizona: decoded.yearInArizona || "",
          receiveCommunications:
            decoded.receiveCommunications || "false",
        };

        setProfile(mapped);

        setFormData({
          id: mapped.id,
          firstName: mapped.firstName,
          lastName: mapped.lastName,
          workemail: mapped.email,
          mediaOutlet: mapped.mediaOutlet,
          title: mapped.title,
          cellPhone: mapped.cellPhone,
          workPhone: mapped.workPhone,
          linkedIn: mapped.linkedIn,
          yearBegan: mapped.yearInMedia,
          yearStarted: mapped.yearInArizona,
          interestCategories: mapped.categories
            ? mapped.categories.split(",")
            : [],
          publishedLink: mapped.biography,
          receiveComm:
            mapped.receiveCommunications.toLowerCase() === "true",
        });

        // Populate react-hook-form values so validation has initial values
        setValue("firstName", mapped.firstName);
        setValue("lastName", mapped.lastName);
        setValue("workemail", mapped.email);
        setValue("mediaOutlet", mapped.mediaOutlet);
        setValue("title", mapped.title);
        setValue("cellPhone", mapped.cellPhone);
        setValue("workPhone", mapped.workPhone);
        setValue(
          "interestCategories",
          mapped.categories ? mapped.categories.split(",") : []
        );
        setValue("yearBegan", mapped.yearInMedia);
        setValue("yearStarted", mapped.yearInArizona);
        setValue(
          "receiveComm",
          mapped.receiveCommunications.toLowerCase() === "true"
        );
      })
      .catch(() => router.push("/login"));
  }, [router, setValue]);

  /* ---------------------------------------------
     Handle Form Change
  --------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const togglePassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ---------------------------------------------
     Submit
     (called by react-hook-form)
  --------------------------------------------- */
  const handleSubmit = async () => {
    // ========== PASSWORD VALIDATION  ==========
    if (passwords.new || passwords.confirm || passwords.current) {
      if (passwords.new !== passwords.confirm) {
        setMessageType("error");
        setSuccessMessage(
          "New password and Confirm password do not match."
        );
        return;
      }

      if (!passwords.current) {
        setMessageType("error");
        setSuccessMessage("Please enter your current password.");
        return;
      }

      if (passwords.current === passwords.new) {
        setMessageType("error");
        setSuccessMessage(
          "Current password and New password cannot be the same."
        );
        return;
      }
    }

    // ========== API CALL ==========
    const data = await updateProfileWithPasswordApi({
      Id: formData.id,
      Email: formData.workemail,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      MediaOutlet: formData.mediaOutlet,
      WorkPhone: formData.workPhone,
      CellPhone: formData.cellPhone,
      LinkedIn: formData.linkedIn,
      Biography: formData.publishedLink,
      Categories: formData.interestCategories.join(","),
      Title: formData.title,
      MediaBeat: "",
      YearInMedia: formData.yearBegan,
      YearInArizona: formData.yearStarted,
      ReceiveCommunications: formData.receiveComm,
      CurrentPassword: passwords.current,
      NewPassword: passwords.new || null,
    });

    // Show backend message
    setSuccessMessage(data.message);
    setMessageType(data.success ? "success" : "error");

    // If success
    if (data.success) {
      await setAuthCookie(data.token);
      setPasswords({ current: "", new: "", confirm: "" });

      setTimeout(() => {
        setSuccessMessage("");
        setMessageType("");
      }, 4000);
    }
  };

  /* ---------------------------------------------
     Logout
  --------------------------------------------- */
  const handleLogout = async () => {
    await deleteAuthCookie();
    router.push("/login");
  };

  /* ---------------------------------------------
     STATIC-LIKE UI (EXACT)
  --------------------------------------------- */
  return (
    <>
      <AuthPageHeader
        title="My Account"
        subtext=""
        backgroundColor="--dark-blue-color"
        className="!pt-15 !pb-15 md:pt-20 md:pb-15 px-4 md:px-34"
      />
      <div className="py-10 md:py-20 px-[15px] md:px-[135px]">
        {/* MAIN FORM EXACT STRUCTURE */}
        <form
          onSubmit={handleFormSubmit(handleSubmit)}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 md:gap-x-12.5 md:gap-y-10">
            {[
              { label: "First Name", name: "firstName" },
              { label: "Last Name", name: "lastName" },
              { label: "Work Email Address", name: "workemail" },

              { label: "Media Outlet", name: "mediaOutlet" },
              { label: "Title", name: "title" },
              { label: "Cell Phone", name: "cellPhone" },

              { label: "Work Phone", name: "workPhone" },

              {
                label: "Year Began in Arizona Media",
                name: "yearBegan",
                type: "year",
              },
              {
                label: "Year Started in Arizona Media",
                name: "yearStarted",
                type: "year",
              },

              { label: "LinkedIn", name: "linkedIn" },
              {
                label: "Areas of Interest",
                name: "interestCategories",
                type: "dropdown",
              },
              {
                label: "Link to Published Work or Biography",
                name: "publishedLink",
              },
            ].map((field, index) => (
              <div key={index}>
                <label className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-1.5 md:mb-3 !leading-[1.4]">
                  {field.label}
                </label>

                {/* YEAR DROPDOWN */}
                {field.type === "year" && (
                  <>
                    <Dropdown
                      value={(formData as any)[field.name]}
                      onChange={(value) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          [field.name]: value,
                        }));
                        setValue(field.name, value);
                      }}
                      placeholder="YYYY"
                      options={Array.from({ length: 40 }).map((_, i) => {
                        const year = 2024 - i;
                        return { label: String(year), value: String(year) };
                      })}
                      className={`border-b !p-0 ${(errors as any)[field.name]
                        ? "border-red-600"
                        : "border-[#222E6966]"
                        }`}
                    />
                    {(errors as any)[field.name] && (
                      <p className="text-red-600 text-sm mt-1">
                        {(errors as any)[field.name]?.message}
                      </p>
                    )}
                  </>
                )}

                {/* INTEREST DROPDOWN */}
                {field.type === "dropdown" && (
                  <>
                    <MultiSelectDropdown
                      value={formData.interestCategories}
                      options={[
                        { label: "Education", value: "Education" },
                        { label: "Health", value: "Health" },
                        { label: "Science", value: "Science" },
                        { label: "Technology", value: "Technology" },
                        { label: "Business", value: "Business" },
                        { label: "Entertainment", value: "Entertainment" },
                      ]}
                      className={`border-b !p-0 ${(errors as any).interestCategories
                        ? "border-red-600"
                        : "border-[#222E6966]"
                        }`}
                      onChange={(newValues) => {
                        setFormData((prev: any) => ({
                          ...prev,
                          interestCategories: newValues,
                        }));
                        setValue("interestCategories", newValues);
                      }}
                      placeholder="Select Interest Categories"
                    />
                    {(errors as any).interestCategories && (
                      <p className="text-red-600 text-sm mt-1">
                        {(errors as any).interestCategories?.message}
                      </p>
                    )}
                  </>
                )}

                {/* INPUT FIELDS */}
                {!field.type && (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        {...register(field.name)}
                        name={field.name}
                        value={(formData as any)[field.name]}
                        onChange={(e) => {
                          handleChange(e);
                          setValue(field.name, (e.target as HTMLInputElement).value);
                        }}
                        className={`subhead w-full border-b pb-2.5 focus:outline-none text-[var(--blue-color)] !leading-[1.6] ${(errors as any)[field.name]
                          ? "border-red-600"
                          : "border-[#222E6966]"
                          }`}
                      />
                      <FaPencil className="absolute right-1 top-1 text-[var(--blue-color)] text-l md:text-xl" />
                    </div>

                    {(errors as any)[field.name] && (
                      <p className="text-red-600 text-sm mt-1">
                        {(errors as any)[field.name]?.message}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* CHECKBOX */}
          <div className="hidden sm:flex justify-center mt-10 mb-10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("receiveComm")}
                name="receiveComm"
                checked={formData.receiveComm}
                onChange={(e) => {
                  const checked = (e.target as HTMLInputElement).checked;
                  setFormData((prev: any) => ({ ...prev, receiveComm: checked }));
                  setValue("receiveComm", checked);
                }}
                className="hidden"
              />

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${formData.receiveComm
                  ? "bg-[var(--dark-blue-color)]"
                  : "bg-white border-2 border-[var(--dark-blue-color)]"
                  }`}
              >
                {formData.receiveComm && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="white"
                    fill="none"
                    className="w-4 h-4"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span className="body-text-large text-[#003960] !leading-[1.6]">
                I wish to receive communications from the Arizona Media Institute.
              </span>
            </label>
          </div>

          {/* PASSWORD SECTION */}
          <div className="mt-8 md:mt-20">
            <h2 className="heading-4 text-[var(--dark-blue-color)] mb-6 md:mb-10 sm:text-left">
              Change Password
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 md:gap-x-12.5 md:gap-y-10 mb-6 md:mb-10">
              {[
                { label: "Current Password", name: "current" },
                { label: "New Password", name: "new" },
                { label: "Confirm New Password", name: "confirm" },
              ].map((field, i) => (
                <div key={i} className="relative">
                  <label className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-1.5 md:mb-3 !leading-[1.4]">
                    {field.label}
                  </label>

                  <input
                    type={
                      showPasswords[field.name as keyof typeof showPasswords]
                        ? "text"
                        : "password"
                    }
                    value={(passwords as any)[field.name]}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    placeholder="********"
                    className="subhead w-full border-b border-[#222E6966] pb-2.5 focus:outline-none text-[var(--blue-color)] bg-transparent placeholder:text-[var(--blue-color)] !leading-[1.6]"
                  />

                  <button
                    type="button"
                    onClick={() => togglePassword(field.name as any)}
                    className="absolute right-1 top-8 md:top-10"
                  >
                    {showPasswords[field.name as keyof typeof showPasswords] ? (
                      <FaEyeSlash className="text-[var(--blue-color)]" />
                    ) : (
                      <FaEye className="text-[var(--blue-color)]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* SUCCESS MESSAGE */}
          {/* SUCCESS / ERROR MESSAGE */}
          {successMessage && (
            <p
              className={`text-center mb-4 font-semibold ${messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
            >
              {successMessage}
            </p>
          )}

          {/* SUBMIT */}
          <div className="flex justify-center md:mb-20">
            <Button
              variant="dark-blue"
              type="submit"
              className="w-full sm:w-1/2 lg:w-1/4 !px-7.5 !py-4 text-base"
            >
              Save Changes
            </Button>
          </div>
        </form>

        {/* LOGOUT BUTTON */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
