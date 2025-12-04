"use client";

import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import { buildMediaUrl } from "@/app/utils/buildMediaUrl";
import { ExpertCardProps } from "@/app/types/expert/ExpertCardProps";

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const router = useRouter();

  return (
    <div
      key={expert.id}
      className="bg-transparent rounded-[20px] rounded-b-[30px] pb-0 flex flex-col h-full"
    >
      {/* Profile Image */}
      <div className="w-full aspect-square p-4 rounded-[20px] overflow-hidden">
        {expert.headShot ? (
          <img
            src={buildMediaUrl(expert.headShot)}
            alt={expert.expertName}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div className="bg-light-blue w-full h-full flex items-center justify-center rounded-2xl">
            <FaUserCircle className="text-dark-blue rounded-full" size={200} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex p-4 flex-col">
        <h6 className="heading-6 text-white mb-2 md:mb-1">
          {expert.expertName}
        </h6>

        <p className="body-text-small text-white mb-4 !font-semibold">
          {expert.titleAtCompany}
        </p>

        {/* Contact Information */}
        <div className="space-y-[5px] mb-4 flex-1">
          <div className="flex items-center text-white text-sm !leading-[1.5]">
            <FaMapMarkerAlt
              className="text-light-orange mr-2.5 flex-shrink-0"
              size={18}
            />
            <span className="truncate">{expert.locations}</span>
          </div>

          <div className="flex items-center text-white text-sm !leading-[1.5]">
            <MdMail
              className="text-light-orange mr-2.5 flex-shrink-0"
              size={18}
            />
            <span className="truncate">{expert.email}</span>
          </div>

          <div className="flex items-center text-white text-sm !leading-[1.5]">
            <IoCall
              className="text-light-orange mr-2.5 flex-shrink-0"
              size={18}
            />
            <span>{expert.phoneNumber}</span>
          </div>
        </div>
      </div>

        {/* View Profile Button */}
        <div className=" flex flex-col">
          <Button
            variant="transparent"
            showArrow={true}
            className="!justify-between !pr-1 !rounded-[58px] !bg-[rgba(255,255,255,0.15)]"
            onClick={() => router.push(expert.pageUrl)}
          >
            View Bio
          </Button>
        </div>
    
    </div>
  );
};

export default ExpertCard;
