import sanitizeHtml from "sanitize-html";

export function cleanRichText(input: any): string {
  if (!input) return "";

  let html: string = "";

  if (typeof input === "string") {
    html = input;
  } else if (typeof input === "object") {
    html = input?.markup || input?.html || "";
  }

  if (!html || typeof html !== "string") return "";

  // Fix MS Word list structure
  html = html.replace(
    /<li[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi,
    "<li>$1</li>"
  );

  // Remove MS Word classes
  html = html.replace(/class="Mso[^"]*"/gi, "");

  // Strip inline styles
  html = html.replace(/style="[^"]*"/gi, "");

 return sanitizeHtml(html, {
  allowedTags: [
    "div",
    "p",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "a",
    "span",
    "br",
    "section",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
  ],
  allowedAttributes: {
    "*": ["class"],
    a: ["href", "target", "rel"],
  }
});

}
