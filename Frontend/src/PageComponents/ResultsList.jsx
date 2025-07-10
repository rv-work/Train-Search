import React, { useState, useContext } from "react";
import List from "../Components/List";
import Multi from "../Components/Multi";
import context from "../Context/context";
import MultiLoader from "./MultiLoader";

const ResultsList = () => {
  const { direct, multi, fromStation, multiLoading, toStation } = useContext(context);

  const directTrains = direct || [];
  const multiTrainConnections = multi || [];

  const [activeTab, setActiveTab] = useState("direct");
  const [selectedJourney, setSelectedJourney] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedJourney(null); 
  };

  return (
    <div className="relative bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full">
      {selectedJourney && activeTab === "multi" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-10"></div>
      )}

      <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
        Available Trains
      </h1>

      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => handleTabChange("direct")}
          className={`px-4 py-2 sm:px-6 rounded-lg font-semibold transition-colors ${
            activeTab === "direct"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Direct Trains ({directTrains.length})
        </button>
        <button
          onClick={() => handleTabChange("multi")}
          className={`px-4 py-2 sm:px-6 rounded-lg font-semibold transition-colors ${
            activeTab === "multi"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Multi-Train Journeys ({multiTrainConnections.length})
        </button>
      </div>

      <div className={`w-full ${selectedJourney && activeTab === "multi" ? "blur-md" : ""}`}>
        {activeTab === "direct" ? (
          <div className="grid grid-cols-1 gap-6">
            {directTrains.length > 0 ? (
              directTrains.map((train, index) => (
                <List
                  key={index}
                  train={train}
                  fromStation={fromStation}
                  toStation={toStation}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No direct trains available.
              </p>
            )}
          </div>
        ) : (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {multiTrainConnections.length > 0 ? (
              multiTrainConnections.map((journey, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => setSelectedJourney(journey)}
                >
                  <Multi journey={journey} showButton={false} center={false} />
                </div>
              ))
            ) : ( 
                   multiLoading === true ?  (
                     null
                   ) : (
                         <p className="text-center text-gray-500 col-span-full">
                             No multi-train journeys available.
                        </p>
                        )
                  
                )
            }
          </div >
          {multiLoading && <MultiLoader /> }
          </div>
          
        )}
      </div>

      {selectedJourney && activeTab === "multi" && (
        <div className="fixed inset-0 flex items-center justify-center z-20 p-4">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto relative">
            <button
              onClick={() => setSelectedJourney(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-center mb-4">
              Multi-Train Journey Details
            </h2>
            <Multi journey={selectedJourney} showButton={true} center={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
