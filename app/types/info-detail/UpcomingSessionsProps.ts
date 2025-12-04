import { LinkItem } from "..";

export interface UpcomingSessionsProps {
  headline?: string;

  seeAllSessionCta?: LinkItem[];

  leftArrowClass?: string | null;
  rightArrowClass?: string | null;
}

export interface SessionItem {
  id: number;
  pageUrl: string;
  eventName: string;
  date: string | null;
  type: string;
  sessionDescription: string;
signUpCta?: {
    name?: string;
    url?: string;
    target?: string | null;
  };

   formSelection?: {
    formId?: string | null;
    theme?: string | null;
    redirectToPageId?: number | null;
    form?: any | null;
  };
    location: string;
  icon?: string;
}
