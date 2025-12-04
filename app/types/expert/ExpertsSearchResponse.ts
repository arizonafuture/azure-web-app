import { LinkItem } from "..";

export interface ExpertsSearchResponse {
  id: number;
  pageUrl: string;
  expertName: string;
  titleAtCompany: string;
  email: string;
  phoneNumber: string;
  availabilityType: string;
  locations: string;
  headShot: string;
  keytopics: string[];
  description: string;
  linkedInUrl: LinkItem[];
}
