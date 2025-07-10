const Loader = () => {
  return (
    <div
      className="flex flex-col justify-center items-center h-60 space-y-6"
      aria-label="Loading options. Please wait."
    >
      <div className="relative">
        <div
          className="animate-spin-slow rounded-full h-32 w-32 border-t-4 border-red-500 border-solid"
          style={{ willChange: "transform" }}
        ></div>

        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="animate-spin-medium rounded-full h-24 w-24 border-t-4 border-green-500 border-solid"
            style={{ willChange: "transform" }}
          ></div>
        </div>

        <div className="absolute inset-0 flex justify-center items-center">
          <div
            className="animate-spin-fast rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
            style={{ willChange: "transform" }}
          ></div>
        </div>
      </div>

      <p className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-blue-700">
        <span className="animate-pulse">
          Please wait! We’re finding the best options for you...
        </span>
      </p>

      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
    </div>
  );
};

export default Loader;
