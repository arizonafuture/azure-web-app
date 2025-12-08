"use server";

import { getAuthCookie } from "./authCookies";

export async function checkAuth() {
  const token = await getAuthCookie();
    console.log(token)

  return !!token; // true or false
}
