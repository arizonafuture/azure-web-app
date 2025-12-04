const Loader = ({
  className = "",
  progress = 30,
}: {
  className?: string;
  progress?: number;
}) => {
  // Calculate circumference and offset for the progress ring
  //const radius = 45;
  //const circumference = 2 * Math.PI * radius;
  //const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full
      rounded-[20px]
      bg-white/5
      backdrop-blur-[10px]
      flex justify-center items-center
      z-20 ${className}`}
    >
      <div className="w-[72px] h-[72px]  rounded-[72.493px]  border-[11px] border-white border-t-transparent  bg-transparent  animate-spin  box-border  "></div>
    </div>

    // <div role="status" className={`flex items-center justify-center ${className} bg-transparent w-full relative overflow-hidden`}>
    //     <svg
    //         aria-hidden="true"
    //         className="w-20 h-20 animate-spin"
    //         viewBox="0 0 100 100"
    //         fill="none"
    //         xmlns="http://www.w3.org/2000/svg"
    //         style={{ animationDuration: '2s' }}
    //     >
    //         {/* Background white ring */}
    //         <circle
    //             cx="50"
    //             cy="50"
    //             r={radius}
    //             stroke="white"
    //             strokeWidth="10"
    //             fill="none"
    //         />
    //         {/* Progress gray segment */}
    //         <circle
    //             cx="50"
    //             cy="50"
    //             r={radius}
    //             stroke="#9CA3AF"
    //             strokeWidth="10"
    //             fill="none"
    //             strokeDasharray={circumference}
    //             strokeDashoffset={progressOffset}
    //             transform="rotate(-90 50 50)"
    //         />
    //     </svg>
    //     <span className="sr-only">Loading...</span>
    // </div>
  );
};

export default Loader;
