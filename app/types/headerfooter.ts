import { LinkItem, Route } from ".";

export interface HeaderFooter {
  newslettterSection: string;
  formSelection: {
    formId?: string;
    theme?: string | null;
    redirectToPageId?: string | null;
    form?: any;
  };
  submitButton: string;
  subHeading: string;
  icon: MediaItem[];
  siteUrl: LinkItem;
  copyrightText: string;
  socialMediaLinks: SocialMediaLink[];
  usefulLinkTitle: string;
  links: SocialMediaLink[];
  logo: string;
  whiteLogo: string;
  siteNames: string;
  account: string;
  search: string;
}

export interface MediaItem {
  focalPoint: any;
  crops: any[];
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
  properties: Record<string, any>;
}

export interface NavItem {
  title: string;
  url: string;
  children?: NavItem[]; // 👈 add this
  clickable?: boolean; // ✅ add this!
}

export interface HeaderProps {
  logo: string;
  whiteLogo: string;
  navMenu: NavItem[];
  siteName: string;
  account: string;
  search: string;
}
export interface SocialMediaLink {
  name: string;
  target: any;
  type: string;
  udi: any;
  url: string;
}
