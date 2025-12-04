import { HeaderFooter, NavItem } from "./headerfooter";

// Interfaces for Umbraco data structure
export interface MediaItem {
  focalPoint: any; // Could be { x: number; y: number } if used
  crops: any[];
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width?: number;
  height?: number;
  bytes: number;
  properties: Record<string, any>;
}
export interface HeaderResponse {
  header: HeaderFooter;
  navMenu: NavItem[];
}

export interface Route {
  path: string;
  startItem: {
    id: string;
    path: string;
  };
  queryString?: string | null;
}

export interface LinkItem {
  url: string;
  path: string;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string | null;
  destinationType: string | null;
  route?: Route; // Updated: Optional; can be string (legacy), Route object (internal), or null
  linkType: string;
}

export interface BannerProperties {
  heading: string;
  subHeading: string;
  media: MediaItem[];
  exploreButtons: LinkItem[];
  clipText: string;
  clipThumbnail: MediaItem[];
}

export interface HeadlineProperties {
  headline: string;
}

export interface FoodCardProperties {
  title: string;
  shortDescription: string;
  media: MediaItem[];
  link: LinkItem[] | null;
}

export interface ImageBlockProperties {
  image: MediaItem[];
}

export interface RichTextProperties {
  richText: {
    markup: string;
    blocks: any[];
  };
}

export interface ContentProperties {
  // Generic; extend for specific types
  [key: string]: any; // e.g., heading, media, etc.
}

export interface Content {
  contentType: string;
  id: string;
  properties: ContentProperties; // Use specific interfaces like BannerProperties where possible
}

export interface SettingsProperties {
  alignContentLeft: boolean | null;
  alignContentCenter: boolean | null;
  alignContentRight: boolean | null;
  indentTop: boolean | null;
  indentBottom: boolean | null;
  indentSide: boolean | null;
  cssStyles: string | null;
  additionalParameters: string[] | null;
  backgroundColor: string | null;
  fontColor: string | null;
  sectionId?: string | null;
}

export interface Settings {
  contentType: string;
  id: string;
  properties: SettingsProperties;
}

export interface Area {
  alias: string;
  rowSpan: number;
  columnSpan: number;
  items: Item[];
}

export interface Item {
  rowSpan: number;
  columnSpan: number;
  areaGridColumns: number;
  areas?: Area[];
  content: Content;
  settings: Settings;
}

export interface ContentData {
  gridColumns: number;
  items: Item[];
}
export interface ApiResponse {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  properties: {
    content: ContentData;
    header?: ContentData; // New: Optional header grid (only on home page)
  };
  cultures: Record<string, any>;
}

// Component props interfaces
export interface ContentRendererProps {
  content: Content;
  settings: Settings;
  areas?: Area[];
  areaGridColumns?: number;
}

export interface GridRendererProps {
  items: Item[];
  gridColumns?: number;
  parentContentType?: string;
}

export interface SettingsClassProps {
  settings: Settings | null;
}

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Form {
  id: string;
}

export interface Description {
  markup: string;
  blocks: any[];
}

export interface UmbracoRouteInfo {
  path: string;
  queryString: string | null;
  startItem: {
    id: string;
    path: string;
  };
}

export interface UmbracoProperties {
  metaTitle?: string;
  metaDescription?: string;
    metaKeyword?: string;

    pageTitle?: string;

  // canonicalUrl?: LinkItem;
  openGraphTitle?: string;
  openGraphDescription?: string;
  [key: string]: any; // allow future fields
}

export interface UmbracoSeoResponse {
  contentType: string;
  name: string;
  createDate: string; // ISO date
  updateDate: string; // ISO date
  route: UmbracoRouteInfo;
  id: string; // GUID
  properties: UmbracoProperties;
  cultures: Record<string, any>;
}
