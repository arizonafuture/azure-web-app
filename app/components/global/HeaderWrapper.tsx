// components/header/HeaderWrapper.tsx
"use server";

import { getAuthCookie } from "@/app/server/authCookies";
import Header from "./Header";

export default async function HeaderWrapper(props: any) {
  const token = await getAuthCookie(); // ✔ server cookie available

  return (
    <Header
      {...props}
      initialToken={token} // pass into client header
    />
  );
}
