import { MEMBER_API_BASE_URL } from "@/app/config/umbraco";

export async function changePasswordApi(email: string, newPassword: string) {
  const response = await fetch(
    `${MEMBER_API_BASE_URL}/changepassword`, // ❌ removed double "//"
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    }
  );

  return response.json();
}


export async function forgotPasswordApi(email: string) {
  const response = await fetch(`${MEMBER_API_BASE_URL}/forgotpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return response.json();
}

export async function loginApi(email: string, password: string) {
  const response = await fetch(`${MEMBER_API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

export async function updateProfileWithPasswordApi(payload: any) {
  const response = await fetch(`${MEMBER_API_BASE_URL}/updateprofilewithpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response.json();
}


export async function registerApi(formData: any) {
  const res = await fetch(`${MEMBER_API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  let json;

  try {
    json = await res.json();
  } catch {
    throw new Error("Server error");
  }

  if (!res.ok) {
    // Backend sends: { success:false, message:"Email already registered" }
    throw new Error(json.message || "Registration failed");
  }

  return json;
}
