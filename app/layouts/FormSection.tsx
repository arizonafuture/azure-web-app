// src/components/components/FourColumnLayout.tsx (updated interface)
import React from "react";
import GridRenderer from "./GridRenderer";
import { Content, Settings, Area } from "../types"; // Import Area
import { getSettingsClass } from "../utils/settings";
// import UmbracoContactForm from "../components/ContactUsForm";

interface FormSectionLayoutProps {
  content: Content;
  settings: Settings;
  areas: Area[]; // Required for layouts
  areaGridColumns?: number;
}

const FormSection: React.FC<FormSectionLayoutProps> = ({ content }) => {
  return (
    <div className={`four-column-layout grid grid-cols-4 gap-4 w-full `}>
      {/* <UmbracoContactForm formId={content.properties?.form.id} /> */}
    </div>
  );
};

export default FormSection;
