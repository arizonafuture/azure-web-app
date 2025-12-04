"use server";
import { cookies } from "next/headers";
export async function setAuthCookie(token: string) {
  cookies().set("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  return cookies().get("authToken")?.value;
}

/** DELETE COOKIE */
export async function deleteAuthCookie() {
  cookies().delete("authToken");
}
