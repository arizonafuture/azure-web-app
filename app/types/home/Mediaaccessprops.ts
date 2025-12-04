import { LinkItem } from "..";

export interface Mediaaccessprops {
  headline: string;
  subheadline: string;
  button: LinkItem[];  // 👈 FIXED: must be an array
}
