import { LinkItem, MediaItem } from "..";

export interface SearchableDataSectionProps {
  mainHeadline?: string;
  mainDescription?: string;
  domoHeadline?: string;
  domoUrl: any;
  expertHeadline?: string;
  expertDescription?: string;
  expertCta?: LinkItem[];
  resourceHeadline?: string;
  resourceCta?: LinkItem[];
  sessionHeadline?: string;
  sessionCta?: LinkItem[];
  backgroundImage?: MediaItem[];
}
