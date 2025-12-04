"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MEMBER_API_BASE_URL } from "@/app/config/umbraco";
import { changePasswordApi } from "../../service/account/MyAccount";

const schema = yup.object({
    newPassword: yup
        .string()
        .min(6, "At least 6 characters")
        .required("New password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your new password"),
});

type Inputs = {
    newPassword: string;
    confirmPassword: string;
};

export default function ChangePasswordForm() {
    const [email, setEmail] = useState<string | null>(null);
    const [serverMessage, setServerMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    // 🟢 Load user email from cookie
    useEffect(() => {
        const rawCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userEmail="))
            ?.split("=")[1];

        if (rawCookie) {
            setEmail(decodeURIComponent(rawCookie)); // ✅ This is correct
        }
    }, []);

    const onSubmit = async (data: Inputs) => {
        if (!email) {
            setServerMessage("⚠️ Please log in first to change your password.");
            return;
        }

        setLoading(true);
        setServerMessage("");

        try {

            const result = await changePasswordApi(email, data.newPassword);

            if (result.success) {
                setServerMessage(" Password changed successfully!");
            } else {
                setServerMessage(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("Password change failed:", error);
            setServerMessage("❌ Unable to change password. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0B1B45] text-white">
                <div className="bg-gradient-to-b from-orange-400 to-orange-600 p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
                    <p className="mb-4">You must be logged in to change your password.</p>
                    <a
                        href="/login"
                        className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B1B45]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-gradient-to-b from-orange-400 to-orange-600 text-white rounded-2xl shadow-lg p-8 w-[420px]"
            >
                <h2 className="text-3xl font-bold text-center mb-2">Change Password</h2>

                <p className="text-center text-sm mb-6">
                    You’re logged in as{" "}
                    <span className="font-semibold text-white bg-blue-900 px-2 py-1 rounded-md">
                        {email}
                    </span>
                </p>

                {/* New Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                        New Password *
                    </label>
                    <input
                        type="password"
                        {...register("newPassword")}
                        placeholder="New Password"
                        className="w-full rounded-full px-4 py-2 text-gray-900 border border-transparent"
                    />
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">
                        Confirm New Password *
                    </label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm New Password"
                        className="w-full rounded-full px-4 py-2 text-gray-900 border border-transparent"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {serverMessage && (
                    <p className="text-center text-sm mt-2">{serverMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-900 text-white font-semibold py-2 rounded-full hover:bg-blue-800 transition"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
