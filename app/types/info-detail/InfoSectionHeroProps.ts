import { LinkItem } from "..";

export interface InfoSectionHeroProps {
  heroBannerHeading?: string | null;
  type?: string[] | []; // Online | In Person | Hybrid
  dateAndTime?: string | null;
  duration?: string | null;
  location?: {
    markup?: string | null;
  } | null;
  joinLink?: LinkItem[];
  signUpCta?: LinkItem[];
}
