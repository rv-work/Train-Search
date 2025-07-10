import React, { useContext } from "react";
import { FaHeart, FaUser, FaBars, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import SearchForm from "../PageComponents/SearchForm";
import ResultsList from "../PageComponents/ResultsList";
import context from "../Context/context";
import Loader from "../Components/Loader";

const HomePage = () => {
  const { direct , multi, loading, search, error , multiLoading } = useContext(context);

  return (
    <div className="bg-gradient-to-b from-[#00172E] to-[#05203C] min-h-screen text-white">
      <div className="mb-5 px-4 sm:px-6 lg:px-36">
        <div className="flex flex-col md:flex-row items-center md:justify-between py-6 md:py-12">
          <Link to="/" className="mb-4 md:mb-0">
            <img src="vite.svg" alt="Logo" className="h-10 sm:h-12" />
          </Link>
          <div className="flex flex-row items-center space-x-4">
            <p className="cursor-pointer text-white hover:bg-gray-400/20 px-3 py-2 rounded transition-all duration-300">
              <FaGlobe size={20} />
            </p>
            <p className="cursor-pointer text-white hover:bg-gray-400/20 px-3 py-2 rounded transition-all duration-300">
              <FaHeart size={20} />
            </p>
            <p className="cursor-pointer text-white flex items-center space-x-2 hover:bg-gray-400/20 px-3 py-2 rounded transition-all duration-300">
              <FaUser size={20} />
              <span className="text-sm sm:text-[14px] font-semibold">Log in</span>
            </p>
            <p className="cursor-pointer text-white hover:bg-gray-400/20 px-3 py-2 rounded transition-all duration-300">
              <FaBars size={20} />
            </p>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Find the Best Way to Travel
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-300">
            Effortlessly explore your travel options and plan your journey.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <SearchForm />
        </div>
      </div>

      {error.length > 0 && (
        <div className="flex justify-center items-center my-6 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md w-full sm:w-3/4 lg:w-1/2">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] px-4 sm:px-8 ">
        {!search ? (
          <div
          className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh] flex flex-col items-center justify-center rounded-lg"
          style={{
            backgroundImage: "url('Train2.cms')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          >
            <div className="bg-black/50 absolute inset-0"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white z-10 relative">
              Welcome to Travel Explorer
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-300 z-10 relative">
              Enter your travel details to begin your journey.
            </p>
          </div>
        ) : loading ? (
          <div className="p-6 md:p-10 text-center bg-white text-gray-900 shadow-md rounded-lg w-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (direct || multi || multiLoading) &&
          (direct.length > 0 ||
            multi.length > 0 || multiLoading) ? (
          <div className="p-6 md:p-10 bg-gray-300 text-gray-900 shadow-md rounded-lg w-full max-h-screen overflow-y-auto">
            <ResultsList />
          </div>
        ) : (
          <div className="p-6 md:p-10 text-center bg-white text-gray-900 shadow-md rounded-lg w-full flex items-center justify-center">
            <p className="text-sm sm:text-lg font-semibold text-gray-700">
              No results found for the selected route and date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
