import { Route } from "..";

export interface FeaturedStorySection {
  heading: string;
  subHeading: string;
  submitStoryButton?: SubmitStoryButton[];
  featuredStory?: FeaturedStory;
}

export interface SubmitStoryButton {
  url: any;
  queryString: any;
  title: string;
  target: any;
  destinationId: string;
  destinationType: string;
  route: Route;
  linkType: string;
}
export interface FeaturedStory {
  gridColumns: number;
  items: StoryItem[];
}

interface StoryItem {
  content: {
    id: string;
    contentType: string;
    properties: StoryProperties;
  };
  settings?: {
    properties?: {
      backgroundColor?: string | null;
      fontColor?: string | null;
      cardFooterColor?: string | null;
    };
  };
}
interface StoryProperties {
  storyTitle: string;
  author: string;
  category: string;
  readMore: ReadMoreLink[];
}
interface ReadMoreLink {
  url: string;
  title: string;
  linkType: string;
}
