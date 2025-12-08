import { LinkItem } from "..";

export interface SharedPrioritiesProps {
  headline: string;
  shortDescription: string;
  bottomParagraph?: {
    markup: any;
  };
  iconList: {
    gridColumns: number;
    items: {
      content: {
        id: string;
        properties: {
          urlAndLabel: LinkItem[];
          icon: string;
        };
      };
    }[];
  };
}
