import { getContentByPath } from "../hooks/useUmbracoContent";
import GridRenderer from "../layouts/GridRenderer";
import { ContentData } from "../types";
import SearchPage from "../components/search/SearchPage";

interface PageProps {
  params: { path?: string[] };
  searchParams?: { q?: string; tab?: string };
}

export default async function Home({ params, searchParams }: PageProps) {
  const pagePath = "/" + (params.path?.join("/") || "");
  if (pagePath === "/search") {
    const q = searchParams?.q || "";
    const tab = (searchParams?.tab as any) || "general";
    return <SearchPage initialQuery={q} initialTab={tab} />;
  }
  const contentData = await getContentByPath(pagePath);

  // Extract content safely
  const content = contentData?.properties?.content;

  // ✨ If no content -> show fallback message
  if (!content) {
    return (
      <main className="p-10 text-center">
        <div className="text-xl font-semibold text-gray-600">
          No data found for this page.
        </div>
      </main>
    );
  }

  // Safe destructure (now guaranteed to exist)
  const { items: contentItems, gridColumns: contentGridColumns }: ContentData =
    content;

  return (
    <main>
      <GridRenderer items={contentItems} gridColumns={contentGridColumns} />
    </main>
  );
}
