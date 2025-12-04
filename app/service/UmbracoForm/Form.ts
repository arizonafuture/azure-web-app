import { UMBRACO_FORM_GET, UMBRACO_FORM_POST } from "@/app/config/umbraco";

// 📌 Get Form Definition (fields, structure, labels etc.)
export async function getFormDefinitionApi(formId: number | string) {
  const res = await fetch(`${UMBRACO_FORM_GET}${formId}`);
  return res.json();
}

// 📌 Submit Form
export async function SubmitForms(formId?: string, fields?: any) {
  try {
    const response = await fetch(`${UMBRACO_FORM_POST}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        formId,
        fields,
      }),
    });

    if (!response.ok) {
      throw new Error(`Form submit failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result);
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }
}
