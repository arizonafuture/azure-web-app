const RegisterOrLoginSession: React.FC<{
  headline?: string;
  allInformationSession?: number;
}> = ({ headline, allInformationSession }) => {
  return (
    <div className="mb-16 md:mb-20">
      <h3 className="heading-3 !font-bold text-white mb-6 md:mb-10">
        {headline}
      </h3>
      <div className="bg-transparent rounded-lg p-6 md:p-8">
        <p
          className="text-gray-300 text-base md:text-lg !font[Verdana]"
        >
          We found{" "}
          <strong className="text-white">
            {allInformationSession && allInformationSession != 0
              ? allInformationSession
              : "0"}{" "}
            sessions
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
export default RegisterOrLoginSession;
