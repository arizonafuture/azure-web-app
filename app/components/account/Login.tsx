"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginApi } from "@/app/service/account/MyAccount";
import { setAuthCookie } from "@/app/server/authCookies";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: yup.string().required("Password is required."),
});

type Inputs = { email: string; password: string };
type LoginFormProps = { headerText?: string };

export default function LoginForm({ headerText }: LoginFormProps) {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const returnUrl = window.location.pathname;  // ALWAYS correct


  const { register, handleSubmit, formState: { errors } } =
    useForm<Inputs>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: Inputs) => {
    setLoading(true);
    setServerError("");

    try {
      const result = await loginApi(data.email, data.password);

      if (!result.success) {
        setServerError(result.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      await setAuthCookie(result.token);
      let redirectTo = "/";

      if (returnUrl && returnUrl !== "/login") {
        redirectTo = returnUrl;
      }

      window.location.href = redirectTo;



    } catch (err) {
      console.error("🔥 Login error:", err);
      setServerError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="-mt-45">
      <div className="pb-10 md:pb-20 px-4 md:px-58.5">
        <div className="w-full flex justify-center relative">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)] rounded-2xl p-7.5 sm:p-8 md:p-12.5 w-full md:w-[500px] lg:w-[600px]"
          >
            {headerText && (
              <p
                className="text-[var(--dark-blue-color)] text-center body-text-large !font-bold !leading-[1.6] mb-6"
              >
                {headerText}
              </p>
            )}

            {/* EMAIL */}
            <div className="mb-6 md:mb-7.5">
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Email <span className="text-[var(--red-color)]">*</span>
              </label>

              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`body-text w-full rounded-full px-6 py-3 !leading-[1.6] bg-white ${errors.email
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.email && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-6 md:mb-7.5">
              <label
                className="body-text block text-sm !font-bold text-[var(--blue-color)] mb-2 !leading-[1.4] ml-[25px]"
              >
                Password <span className="text-[var(--red-color)]">*</span>
              </label>

              <input
                type="password"
                placeholder="********"
                {...register("password")}
                className={`body-text w-full rounded-full px-6 py-3 !leading-[1.6] bg-white ${errors.password
                  ? "border border-red-600 placeholder-red-400"
                  : "focus:outline-none focus:ring-2 focus:ring-[var(--dark-blue-color)]"
                  }`}
              />

              {errors.password && (
                <p className="text-red-600 text-sm mt-1 ml-4">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SERVER ERROR */}
            {serverError && (
              <p className="text-red-600 text-center mb-3 text-sm">
                {serverError}
              </p>
            )}

            {/* BUTTON */}
            <div className="flex justify-center mb-6 md:mb-5 w-full">
              <Button variant="dark-blue" type="submit" className="w-full">
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-auto text-[var(--blue-color)]">
              <p className="body-text-small text-[var(--blue-color)] sm:text-base">
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  className="body-text-small text-[var(--blue-color)] !font-bold hover:underline"
                >
                  Create one today.
                </Link>
              </p>

              <Link
                href="/forgot-password"
                className="body-text-small text-[var(--blue-color)] !font-bold underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
