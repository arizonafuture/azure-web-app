const RegisterOrLoginExpert: React.FC<{
  headline?: string;
  description?: string;
  allExpertCount?: number;
}> = ({ headline, description, allExpertCount }) => {
  return (
    <div className="mb-16 md:mb-20">
      <h3 className="heading-3 !font-bold text-white mb-2">{headline}</h3>
      <p className="body-text text-white mb-6 md:mb-10 leading-relaxed w-full">
        {description}
      </p>
      <div className="bg-transparent rounded-lg p-6">
        <p
          className="text-gray-300 text-base md:text-lg !font[Verdana]"
        >
          We found{" "}
          <strong className="text-white">
            {allExpertCount && allExpertCount != 0 ? allExpertCount : "0"}{" "}
            expert contacts
          </strong>{" "}
          related to your search.{" "}
          <a
            href="/register"
            className="text-light-orange underline hover:text-light-orange"
          >
            Register
          </a>{" "}
          or{" "}
          <a
            href="/login"
            className="text-light-orange underline hover:text-light-orange"
          >
            log in
          </a>{" "}
          to view.
        </p>
      </div>
    </div>
  );
};
export default RegisterOrLoginExpert;
