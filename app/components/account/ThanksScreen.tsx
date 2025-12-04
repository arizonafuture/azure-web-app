"use client";

import Button from "../common/Button";

export default function ThanksScreen({ offset = true}) {
    return (
        <div className={offset ? "w-full pt-32 pb-24 flex justify-center relative" : ""}>
            <div className={offset ? "-mt-70" : ""}>
                <div
                    className="
            bg-[linear-gradient(134deg,#FCB447_30%,#FF8526_100%)] 
            rounded-2xl shadow-lg 
            p-7.5 sm:p-8 md:p-12.5 
            w-full sm:w-[90%] md:w-[700px] lg:w-[850px] 
            text-center
          "
                >
                    {/* Progress Indicator */}
                    <div className="flex gap-5 mb-6 md:mb-7.5">
                        <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
                        <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-gray-300"></div>
                        <div className="h-2 pt-[5px] pr-[5px] pb-[5px] pl-7.5 flex-1 rounded bg-[var(--dark-blue-color)]"></div>
                    </div>

                    {/* Title */}
                    <h2 className="heading-2 text-[var(--dark-blue-color)] mb-6 md:mb-7.5 leading-tight">
                        Thank You
                    </h2>

                    {/* Message */}
                    <p
                        className="body-text-large text-[var(--blue-color)] mx-auto mb-6 md:mb-7.5 leading-relaxed !leading-[1.6]"
                    >
                        You now have access to exclusive features of the Arizona Media
                        Institute, pending verification of your active media credentials.
                        Enjoy the resources, and you will be contacted if additional
                        information is required.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="information-sessions">
                            <Button
                                variant="dark-blue"
                                className="w-full sm:w-auto !px-7.5 py-3 text-base"
                            >
                                Explore Info Sessions
                            </Button>
                        </a>
                        <a href="independent-experts">
                            <Button
                                variant="dark-blue"
                                className="w-full sm:w-auto !px-7.5 py-3 text-base"
                            >
                                Find Independent Experts
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}