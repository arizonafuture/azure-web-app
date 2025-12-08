"use client";

import GeneralFeedbackForm from "./GeneralFeedbackForm";
import RequestHelpWithStory from "./RequestHelpWithStory";
import ShareAStoryForm from "./ShareAStoryForm";
import { useState } from "react";
import Tabs from "./Tabs";
import AuthPageHeader from "../common/AuthPageHeader";
import { ContentRendererProps } from "@/app/types";
import { FormsProps } from "@/app/types/contact-us/FormsProps";


const DisplayForms = ({ content }: ContentRendererProps) => {
    const { form2, shareAStoryForm, generalFeedbackForm } = content.properties as FormsProps;

    const [activeTab, setActiveTab] = useState<
        "requestHelp" | "shareStory" | "generalFeedback"|null
    >("requestHelp");

    // ⭐ each time tab changes → increase this value
    const [resetTrigger, setResetTrigger] = useState(0);

    // const handleTabChange = (tab: "requestHelp" | "shareStory" | "generalFeedback") => {
    //     setActiveTab(tab);
    //     setResetTrigger(prev => prev + 1); // ⭐ tell forms to reset
    // };

    return (
        <div className="w-full">
        <div className="w-full -mt-50 md:-mt-40 pb-24 flex justify-center relative px-4 md:px-0">
        {/* FULL-WIDTH ORANGE BACKGROUND INSIDE THE CARD */}
        <div className="w-full max-w-4xl rounded-t-xl">
          <Tabs
           activeTab={activeTab}
           setActiveTab={(t) => {
             setActiveTab(t);
           }}
           setSubmitted={() => { }}
         >
            {activeTab === "requestHelp" && (
              <RequestHelpWithStory
              formId={form2.formId}
              resetTrigger={resetTrigger}
          />
            )}
            { activeTab === "shareStory" && (
              <ShareAStoryForm
              formId={shareAStoryForm.formId}
              resetTrigger={resetTrigger}
          />
            )}
            {activeTab === "generalFeedback" && (
             <GeneralFeedbackForm
             formId={generalFeedbackForm.formId}
             resetTrigger={resetTrigger}
         />
            )}
            </Tabs>
        </div>
        </div>
      </div>

        // <div className="w-full">
        //     <div className="w-full -mt-50 md:-mt-40 pb-24 flex justify-center relative px-4 md:px-0">
        //         <div className="w-full max-w-4xl rounded-t-xl">

        //             <Tabs
        //                 activeTab={
        //                     activeTab === "requestHelp"
        //                         ? "request"
        //                         : activeTab === "shareStory"
        //                             ? "share"
        //                             : "feedback"
        //                 }
        //                 setActiveTab={(tab) => {
        //                     if (tab === null) return;  // ⭐ ignore null safely

        //                     const map = {
        //                         request: "requestHelp",
        //                         share: "shareStory",
        //                         feedback: "generalFeedback",
        //                     } as const;

        //                     handleTabChange(map[tab]);
        //                 }}
        //                 setSubmitted={() => { }}
        //             />

        //             <div className="rounded-b-2xl overflow-hidden relative">
        //                 <div style={{ display: activeTab === "requestHelp" ? "block" : "none" }}>
        //                     <RequestHelpWithStory
        //                         formId={form2.formId}
        //                         resetTrigger={resetTrigger}
        //                     />
        //                 </div>

        //                 <div style={{ display: activeTab === "shareStory" ? "block" : "none" }}>
        //                     <ShareAStoryForm
        //                         formId={shareAStoryForm.formId}
        //                         resetTrigger={resetTrigger}
        //                     />
        //                 </div>

        //                 <div style={{ display: activeTab === "generalFeedback" ? "block" : "none" }}>
        //                     <GeneralFeedbackForm
        //                         formId={generalFeedbackForm.formId}
        //                         resetTrigger={resetTrigger}
        //                     />
        //                 </div>
        //             </div>

        //         </div>
        //     </div>
        // </div>
    );
};

export default DisplayForms;
