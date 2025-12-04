"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import Button from "../../components/common/Button";
import { MEMBER_API_BASE_URL } from "@/app/config/umbraco";
import { forgotPasswordApi } from "../../service/account/MyAccount";

const schema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
});

type Inputs = { email: string };

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [serverMessage, setServerMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    // 🔥 Reusable error styling (same like Step1, Step2, Login)
    const getInputClass = (hasError: boolean) =>
        `w-full rounded-full px-4 py-3 bg-white text-black ${hasError
            ? "border border-red-600 placeholder-red-400"
            : "focus:ring-2 focus:ring-[var(--dark-blue-color)]"
        }`;

    const onSubmit = async (data: Inputs) => {
        setLoading(true);
        setServerMessage(null);

        try {


            const result = await forgotPasswordApi(data.email);
            if (result.success) {
                setServerMessage("✅ Password reset email sent successfully!");
            } else {
                setServerMessage(result.message || "❌ Failed to send email.");
            }
        } catch (err) {
            console.error("Error:", err);
            setServerMessage("❌ Something went wrong. Try again later.");
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
                        className="bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)] rounded-2xl shadow-lg p-7.5 sm:p-8 md:p-12.5 w-full sm:w-[400px] lg:w-[600px]"
                    >
                        {/* Email */}
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
                                className={getInputClass(!!errors.email)}
                                style={{
                                    fontFamily: "Verdana",
                                    fontSize: "clamp(14px, 1.8vw, 16px)",
                                }}
                            />

                            {errors.email && (
                                <p className="text-red-700 text-sm mt-1 ml-4">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Server Message */}
                        {serverMessage && (
                            <p className="text-sm text-center mb-4 text-white">
                                {serverMessage}
                            </p>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center mb-6 w-full">
                            <Button variant="dark-blue" type="submit" className="w-full">
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-4">
                            <span
                                className="body-text-small text-[var(--blue-color)]"
                            >
                                Remember your password?{" "}
                                <Link
                                    href="/login"
                                    className="underline font-bold text-[var(--dark-blue-color)]"
                                >
                                    Log in
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
}
