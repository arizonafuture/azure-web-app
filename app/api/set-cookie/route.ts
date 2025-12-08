"use server";
//app/api/set-cookie/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = cookies().get("authToken")?.value || null;
  return NextResponse.json({ token });
}
