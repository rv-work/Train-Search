import React, { useState, useContext, useMemo } from "react";
import List from "./List";
import context from "../Context/context";

const Multi = ({ journey, showButton, center }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const { toStation, fromStation } = useContext(context);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="bg-[#05203c] p-4 rounded-lg shadow-lg mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-white">
            {`${fromStation.station_name} (${fromStation.station_code}) → ${toStation.station_name} (${toStation.station_code})`}
          </p>
          <h3 className="text-2xl font-bold text-white mt-1">Journey Details</h3>
          <p className="text-sm text-gray-200">{`Total Sections: ${journey.length}`}</p>
        </div>
      </div>

      <div
        className={`mt-4 bg-white p-3 rounded-lg grid gap-6 ${
          !center ? "lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {journey.map((section, sectionIndex) => {
          const fromStationMemo = useMemo(() => ({ station_code: section.from }), [section.from]);
          const toStationMemo = useMemo(() => ({ station_code: section.to }), [section.to]);

          return (
            <div
              key={sectionIndex}
              className="border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800">
                  Part {sectionIndex + 1}:{" "}
                  <span className="text-blue-600">{`${fromStationMemo.station_code} → ${toStationMemo.station_code}`}</span>
                </p>
                {showButton && (
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    aria-expanded={expandedSection === sectionIndex}
                    aria-controls={`section-${sectionIndex}`}
                    className="text-white bg-blue-600 px-3 py-1 rounded-md text-sm font-medium shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    {expandedSection === sectionIndex ? "Hide Trains" : "Show Trains"}
                  </button>
                )}
              </div>

              {expandedSection === sectionIndex && (
                <div id={`section-${sectionIndex}`} className="mt-4 space-y-4 transition-all duration-300">
                  {section.trains.map((train, trainIndex) => (
                    <List
                      key={trainIndex}
                      train={train}
                      fromStation={fromStationMemo}
                      toStation={toStationMemo}
                      maxLimit={89}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Multi;
