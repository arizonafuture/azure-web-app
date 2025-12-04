import React from "react";
import Banner from "../components/home/HeroBanner";
import RowLayout from "./RowLayout";
import FullSectionLayout from "./FullSectionLayout";
import ThreeColumnLayout from "./ThreeColumnLayout";
import FourColumnLayout from "./FourColumnLayout";
import TwoColumnLayout from "./TwoColumnLayout";
import { Area, ContentRendererProps } from "../types";
import WhatYouWillFindSection from "../components/home/WhySection";
import HeroBanner from "../components/home/HeroBanner";
import MediaAccessSection from "../components/home/MediaAccessSection";
import AboutUsSection from "../components/home/AboutUsSection";
import NeedAssistance from "../components/home/NeedAssistance";
import FeaturedStories from "../components/home/FeaturedStories";
import FilterSection from "../components/info-session/UpcomingInfo";
import EducationLandscapeSection from "../components/key-topics/CurrentLandscape";
import TopicUniquenessSection from "../components/key-topics/TopicUniqueness";
import ArizonansValueSection from "../components/key-topics/ArizonansValueSection";
import CareAboutSection from "../components/key-topics/CareAboutSection";
import RequestHelpWithStory from "../components/contact-us/RequestHelpWithStory";
import ContactUsFormComponent from "../components/contact-us/contactUsForm";
import DisplayForms from "../components/contact-us/contactUsForm";
import ContactUsHerosection from "../components/contact-us/contactUsHeroSection";
import PageHeader from "../components/common/PageHeader";
import ResourceSection from "../components/resources/ResourcesSection";
import ResourceDetails from "../components/resources/ResourceDetails";
import ResourcesReferralSection from "../components/info-session/ResourcesReferralSection";
import InfoHeroSection from "../components/info-session/InfoHeroSection";
import RegisterAccount from "../components/account/RegisterAccount";
import ForgotPasswordForm from "../components/account/ForgotPassword";
import LoginForm from "../components/account/Login";
import MyAccount from "../components/account/MyAccount";
import IndependentExpertsSection from "../components/independentexperts/IndependentExpertsSection";

import SessionDetailsSection from "../components/info-detail/SessionDetailsSection";
import UpcomingSessions from "../components/info-detail/UpcomingSessionSection";
import Cookies from "js-cookie"; // <-- Add this import
import ExpertBiography from "../components/experts/ExpertBiography";
import ExpertDetail from "../components/experts/ExpertDetail";
import FindMoreExperts from "../components/experts/FindMoreExperts";
import SharedPrioritiesSection from "../components/about-us/SharedPrioritiesSection";
import ImageWithDescription from "../components/about-us/ImageWithDescription";
import BuiltForJournalistsSection from "../components/about-us/BuiltForJournalistsSection";
import PrivacyPolicy from "../components/privacy-policy/RichTextSection";
import NotFound404 from "../components/404/NotFound404";
import SessionInfoBanner from "../components/info-detail/SessionInfoBanner";
import SearchableDataSection from "../components/home/search/SearchableDataSection";
import RichDescriptionSection from "../components/key-topics/DescriptionOnly";
import SessionSignUpForm from "../components/session-sign-up/signUpForm";
import ProfileSection from "../components/home/ProfileSection";
import ProtectedFallback from "../components/common/ProtectedFallback";
import dynamic from "next/dynamic";
import { getAuthCookie } from "../server/authCookies";
import DescriptionText from "../components/key-topics/DescriptionText";
import NeedAssistanceV2 from "../components/home/NeedAssistanceV2";
const KeyTopicsNav = dynamic(
  () => import("../components/key-topics/NavMenu"),
  { ssr: false } // keep it server-side; safe for pure server component
);
const componentMap: {
  [key: string]: React.ComponentType<any>;
} = {
  heroSection: HeroBanner,
  theWhySection: WhatYouWillFindSection,
  aboutUsSection: AboutUsSection,
  contactUsSection: NeedAssistance,
  featureStoriesSection: FeaturedStories,
  infoHeroSection: InfoHeroSection,
  MoreTools: ResourcesReferralSection,
  upcomingInformationalSessions: FilterSection,
  subPageBanner: PageHeader,
  resourceSearchSection: ResourceSection,
  currentLandscape: EducationLandscapeSection,
  UniquetoAZ: TopicUniquenessSection,
  PublicOpinion: ArizonansValueSection,
  // MicroTopicss: DescriptionOnlySection,
  KeyOutcomes: CareAboutSection,
  contactUsHeroSection: ContactUsHerosection,
  contactUsForm: DisplayForms,
  registerAccount: RegisterAccount,
  forgotPassword: ForgotPasswordForm,
  login: LoginForm,
  myAccount: MyAccount,
  subNavigation: KeyTopicsNav,
  sessionInfoBanner: SessionInfoBanner,
  sessionDetailsSection: SessionDetailsSection,
  upcomingSessionSection: UpcomingSessions,
  resourceDetails: ResourceDetails,
  builtForJournalistsSection: BuiltForJournalistsSection,
  independentExpertsSearch: IndependentExpertsSection,
  sharedPriorities: SharedPrioritiesSection,
  imageWithDescription: ImageWithDescription,
  richTextSection: PrivacyPolicy,
  descriptionOnly: RichDescriptionSection,
  expertsBiography: ExpertBiography,
  expertHeroBanner: ExpertDetail,
  findMoreIndependentExperts: FindMoreExperts,
  searchSection: SearchableDataSection,
  descriptionText: DescriptionText,
  signUpForm: SessionSignUpForm,
  notFoundComponent: NotFound404,
  profileSection: ProfileSection,
  protectedFallback: ProtectedFallback,
  mediaAccessSection: MediaAccessSection,
  contactUsSectionV2: NeedAssistanceV2,
  // Existing simple components (ignore extra props)
  // Layout components: Pass areas and areaGridColumns from props
  umbBlockGridDemoTwoColumnLayoutBlock: (props: ContentRendererProps) => (
    <TwoColumnLayout
      content={props.content}
      settings={props.settings}
      areas={props.areas || []}
      areaGridColumns={props.areaGridColumns || 12}
    />
  ),
  fourColumn: (props: ContentRendererProps) => (
    <FourColumnLayout
      content={props.content}
      settings={props.settings}
      areas={props.areas || []}
      areaGridColumns={props.areaGridColumns || 12}
    />
  ),
  threeColumnLayout: (props: ContentRendererProps) => (
    <ThreeColumnLayout
      content={props.content}
      settings={props.settings}
      areas={props.areas || []}
      areaGridColumns={props.areaGridColumns || 12}
    />
  ),
  fullSection: (props: ContentRendererProps) => (
    <FullSectionLayout
      content={props.content}
      settings={props.settings}
      areas={props.areas || []}
      areaGridColumns={props.areaGridColumns || 12}
    />
  ),
  row: (
    props: ContentRendererProps // If "row" contentType exists
  ) => (
    <RowLayout
      content={props.content}
      settings={props.settings}
      areas={props.areas || []}
      areaGridColumns={props.areaGridColumns || 12}
    />
  ),
  // Add more layouts as needed
  default: (props: ContentRendererProps) => {
    return <></>;
  },
};
const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  settings,
  areas,
  areaGridColumns,
}) => {
  const ContentComponent =
    componentMap[content.contentType] || componentMap.default;
  return (
    <ContentComponent
      content={content}
      settings={settings}
      areas={areas}
      areaGridColumns={areaGridColumns}
    />
  );
};

// if (!authToken) {
//   // Replace protected components with login fallback
//   componentMap.upcomingSessionSection = ProtectedFallback;
//   componentMap.sessionDetailsSection = ProtectedFallback;
//   componentMap.upcomingInformationalSessions = ProtectedFallback;
//   componentMap.findMoreIndependentExperts = ProtectedFallback;
//   componentMap.independentExpertsSearch = ProtectedFallback;
// }

// if (!authToken) {
//   delete componentMap.heroBanner;
//   delete componentMap.upcomingSessionSection;
//   delete componentMap.profileSection;
// }

// if (authToken) {
//   delete componentMap.mediaAccessSection;
// }

export default ContentRenderer;
export type { ContentRendererProps };
export { componentMap };
