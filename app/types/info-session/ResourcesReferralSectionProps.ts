import { LinkItem } from "..";

export interface ResourcesReferralSectionProps{
      headLine: string;
            referralsItem: {
                gridColumns?: number;
                items: ReferralItem[];
            };
            
}
export interface ReferralItem {


       ReferralsTitle: string;
            referralsDescription: string;
            referralsButtonLink?: LinkItem[];
            icon?: string;
}