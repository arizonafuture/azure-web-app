import { useRouter } from "next/navigation";
interface NoSessionFoundProps {
  clearAllFilters: () => void;
}
const NoResourceFound = ({ clearAllFilters }: NoSessionFoundProps) => {
  const router = useRouter();
  return (
    <div className="mb-16 md:mb-20">
      <div className="bg-transparent rounded-lg p-6 md:p-8">
        <p
          className="text-gray-300 text-base md:text-lg !font[Verdana]"
        >
          We're sorry, we don't have any resource that meet your criteria.
          Please{" "}
          <a
            onClick={() => clearAllFilters()}
            className="underline cursor-pointer"
          >
            reset your filters,
          </a>{" "}
          try a different keyword, or{" "}
          <a
            onClick={() => router.push("/login")}
            className="underline cursor-pointer"
          >
            contact us
          </a>{" "}
          for further assistance.
        </p>
      </div>
    </div>
  );
};
export default NoResourceFound;
