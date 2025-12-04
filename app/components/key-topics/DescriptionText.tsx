import { ContentRendererProps } from "@/app/types";
import { cleanRichText } from "@/app/utils/extractRichText";
import parse from "html-react-parser";

const DescriptionText: React.FC<ContentRendererProps> = ({
  content,
  settings,
}) => {
  console.log(content);
  return (
    <section className="bg-light-blue py-10 md:py-12.5">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[135px]">
        <p className="body-text-large text-dark-blue text-center">
          {content.properties.text}
        </p>
      </div>
    </section>
  );
};

export default DescriptionText;
