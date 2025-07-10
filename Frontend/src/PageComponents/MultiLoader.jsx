import { useState, useEffect } from "react";

const MultiLoader = () => {

  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft === 0) return; 
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); 
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center  space-y-6">
      {/* Spinner Loader */}
      <div className="w-8 h-8 border-4  border-blue-500 border-t-transparent rounded-full animate-spin delay-150"></div>
      <p className="text-center text-lg  font-semibold text-blue-700">
      <span className="animate-pulse">
          Please wait! We’re finding the best options for you...
        </span> <br />
        <span className="animate-pulse">
      It can take up to {timeLeft} second{timeLeft !== 1 ? "s" : ""}...
    </span>
      </p>
      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>

      {/* Dots Loader
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
      </div>

      {/* Bar Loader 
      <div className="flex space-x-1">
        <div className="w-2 h-8 bg-blue-500 animate-pulse"></div>
        <div className="w-2 h-8 bg-blue-500 animate-pulse delay-150"></div>
        <div className="w-2 h-8 bg-blue-500 animate-pulse delay-300"></div>
      </div> */}
    </div>
  );
};

export default MultiLoader;
