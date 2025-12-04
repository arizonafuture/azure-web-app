// app/[...path]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getUmbracoSeo } from "./../utils/fetchUmbracoSeo";
import "../globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { RegisterProvider } from "../contexts/RegisterContext";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import { getUmbracoHeaderServer } from "../utils/getUmbracoHeaderServer";
import { HeaderFooter } from "../types/headerfooter";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCookie } from "../server/authCookies";

export async function generateMetadata({
  params,
}: {
  params: { path?: string[] };
}): Promise<Metadata> {
  const routePath = params.path ? `/${params.path.join("/")}` : "/";
  console.log(routePath);
  const seo = await getUmbracoSeo(routePath);

  const metaTitle = seo?.properties?.metaTitle;
  const metaDescription = seo?.properties?.metaDescription;
  const canonicalUrl = seo?.properties?.canonicalUrl?.url;
  const openGraphTitle = seo?.properties?.openGraphTitle;
  const openGraphDescription = seo?.properties?.openGraphDescription;
  const metaKeyword = seo?.properties?.metaKeyword; // ✅ FIXED NAME
  const pageTitle = seo?.properties?.pageTitle;
  return {
    title: pageTitle || "Arizona",
    description: metaDescription || "Arizona Media Institute",
    keywords: metaKeyword || "Arizona Media Institute",

    openGraph: {
      title: openGraphTitle || metaTitle,
      description:
        openGraphDescription || metaDescription || "Arizona Media Institute",

      url: canonicalUrl || undefined,
      type: "website",
    },

    icons: {
      icon: "/logo.ico",
    },
  };
}
// 🔥 Layout wrapper for all dynamic pages (server component, async so we can await header)
export default async function DynamicPathLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { path?: string[] };
}) {
  const pathname = params.path ? `/${params.path.join("/")}` : "/";

  // Read auth cookie
  const token = await getAuthCookie();

  // Exact protected routes
  const protectedRoutes = ["/my-account"];

  // Wildcard protected groups
  // const protectedWildcardPrefix = [
  //   "/information-sessions",
  //   "/independent-experts",
  // ];

  // Exact match
  const isExactProtected = protectedRoutes.includes(pathname);

  // Wildcard match → protects ONLY child pages, not parent pages
  // const isWildcardProtected = protectedWildcardPrefix.some((prefix) =>
  //   pathname.startsWith(prefix + "/")
  // );

  // Redirect if protected and not logged in
  if ((isExactProtected) && !token) {
    redirect("/login");
  }

  // fetch header server-side and cache for 1 hour (adjust inside helper)
  const headerdata = await getUmbracoHeaderServer();

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {headerdata && headerdata.header && (
            <Header
              initialToken={token}
              logo={headerdata.header.logo}
              whiteLogo={headerdata.header?.whiteLogo}
              navMenu={headerdata.navMenu}
              siteName={headerdata.header?.siteNames || ""}
              account={headerdata.header?.account || ""}
              search={headerdata.header?.search || ""}
            />
          )}

          <RegisterProvider>{children}</RegisterProvider>
          {headerdata && headerdata.header && (
            <Footer
              subHeading={headerdata.header?.subHeading || ""}
              formSelection={headerdata.header?.formSelection}
              submitButton={headerdata.header?.submitButton}
              whiteLogo={headerdata.header.whiteLogo}
              siteUrl={headerdata.header?.siteUrl?.url || ""}
              usefulLinkTitle={headerdata.header?.usefulLinkTitle}
              links={headerdata.header?.links}
              socialMediaLinks={headerdata.header?.socialMediaLinks}
              copyrightText={headerdata.header?.copyrightText}
              newslettterSection={headerdata.header?.newslettterSection || ""}
            />
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
