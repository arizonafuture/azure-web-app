import { useRouter } from "next/navigation";

const NoDataFound = () => {
  const router = useRouter();
  return (
    <div className="mb-16 md:mb-20">
      <div className="bg-transparent rounded-lg p-6 md:p-8">
        <p
          className="text-gray-300 text-base md:text-lg !font[Verdana]"
        >
          We don’t have results that match your search right now. Try a
          different keyword or contact us{" "}
          <a
            onClick={() => router.push("/contact-us")}
            className="underline cursor-pointer"
          >
            contact us
          </a>{" "}
          if you’re looking for something specific.
        </p>
      </div>
    </div>
  );
};
export default NoDataFound;
