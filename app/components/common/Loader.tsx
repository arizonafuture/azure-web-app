const Loader = ({
  className = "",
  progress = 30,
}: {
  className?: string;
  progress?: number;
}) => {
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
  );
};

export default Loader;
