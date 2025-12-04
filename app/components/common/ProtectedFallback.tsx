import LoginForm from "../account/Login";

const ProtectedFallback = () => {
  return (
    <div
      className="flex items-center justify-center w-full min-h-screen pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 lg:pt-[325px] lg:pb-[325px] px-4 sm:px-6 md:px-8 lg:px-11 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/img/loginBg/infoSessionLoginBg.png)",
        minHeight: "100vh",
      }}
    >
      <div className="relative h-fit w-full max-w-full flex justify-center">
        <LoginForm headerText="In order to access our upcoming events, please login to your AZ Media Institute account." />
      </div>
    </div>
  );
};
export default ProtectedFallback;
