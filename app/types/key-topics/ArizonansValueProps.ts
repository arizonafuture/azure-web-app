import { LinkItem } from "..";

export interface ArizonansValueProps {
  heading: string;
  description?: string;
  ctaHeading?: string;
  cta?: LinkItem[];
  multiplecta?: LinkItem[];
  block: {
    gridColumns: number;
    items: {
      content: {
        id: string;
        contentType: string;
        properties: {
          headline: string;
          descriptionText: {
            markup: string;
            blocks?: any[];
          };
        };
      };
    }[];
  };
}
