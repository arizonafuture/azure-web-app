import { SessionItem } from "@/app/types/info-detail/UpcomingSessionsProps";
import { truncateText } from "@/app/utils/truncateText";
import { FaCalendarAlt, FaLaptop, FaRegClock, FaRegUser } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

const getSessionIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "online":
      return FaLaptop;
    case "in person":
      return FaRegUser;
    case "hybrid":
      return FaUsersViewfinder;
    default:
      return FaLaptop;
  }
};
const UpcommingSessionCard = ({
  session,
  className,
}: {
  session: SessionItem;
  className?: string;
}) => {
  console.log("session", session);
  // ✅ Map type to icon
  const TypeIcon = getSessionIcon(
    session.type?.length > 0 ? session.type[0] : ""
  );
  const router = useRouter();
  const handleDetails = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "canShowSignUp",
        session.signUpCta ? "true" : "false"
      );
    }

    router.push(session.pageUrl);
  };

  return (
    <div
      key={session.id}
      className="bg-transparent rounded-[20px] p-4 flex flex-col gap-5 self-stretch w-full relative overflow-hidden"
    >
      <div className="flex flex-col gap-4 items-start justify-start self-stretch">
        <div className="flex flex-col gap-3 items-start justify-start self-stretch shrink-0 relative">
          <div className="bg-light-blue rounded-[100px] pt-1 pr-3.5 pb-1 pl-3.5 flex flex-row gap-1.5 items-center justify-center shrink-0 relative">
            <TypeIcon className="text-dark-blue text-sm w-[18px] h-3" />
            <span className="text-dark-blue text-left body-text-small">
              {session.type}
            </span>
          </div>

          <h3 className="heading-6 text-white text-left leading-tight relative self-stretch !leading-[1.2]">
            {session.eventName}
          </h3>

          {session.date && (
            <div className="flex flex-row gap-4 items-start justify-start self-stretch shrink-0 relative flex-wrap">
              <div className="flex flex-row gap-1 align-middle items-center justify-start shrink-0 relative">
                <FaCalendarAlt className="text-light-blue text-sm" />
                <span className="text-white text-left body-text-small">
                  {new Date(session.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex flex-row gap-1 align-middle items-center justify-start shrink-0 relative">
                <FaRegClock className="text-light-blue text-sm" />
                <span className="text-white text-left body-text-small">
                  {new Date(session.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white self-stretch shrink-0 h-px relative overflow-hidden opacity-[0.3]"></div>

        <div className="flex flex-col gap-1 md:gap-2 items-start justify-start self-stretch shrink-0 relative">
          <div className="text-light-blue font-bold text-left text-sm self-stretch">
            Topic
          </div>
          <div className="text-white text-left text-sm self-stretch !leading-[1.5] mb-5">
            {session.sessionDescription
              ? truncateText(session.sessionDescription, 120)
              : ""}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start justify-start self-stretch text-light-orange gap-[25px] mt-auto">
        {session.signUpCta ? (
          // ENABLED BUTTON
          <button
            onClick={() =>
              router.push(
                `/session-sign-up?sessionId=${session.id}&formId=${session.formSelection?.formId || ""
                }`
              )
            }
            className="text-link shrink-0 text-light-orange flex items-center gap-1"
          >
            Sign Up
            <span className="text-link-icon bg-light-orange text-blue">
              <FiArrowRight className="text-dark-blue" />
            </span>
          </button>
        ) : (
          // DISABLED BUTTON
          <button
            disabled
            className="text-link shrink-0 text-gray-500 flex items-center gap-1 opacity-50 cursor-not-allowed"
          >
            Sign Up
            <span className="text-link-icon bg-gray-500 text-blue opacity-50">
              <FiArrowRight className="text-dark-blue opacity-50" />
            </span>
          </button>
        )}




        <input
          type="hidden"
          name="formId"
          value={session.formSelection?.formId || ""}
        />

        <button
          onClick={handleDetails}
          className="text-link shrink-0 text-light-orange flex items-center gap-1"
        >
          Details
          <span className="text-link-icon bg-light-orange text-blue">
            <FiArrowRight className="text-dark-blue" />
          </span>
        </button>

      </div>
    </div >
  );
};
export default UpcommingSessionCard;
