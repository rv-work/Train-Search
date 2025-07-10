import { useState } from "react";
import { FaClock } from "react-icons/fa";
import DetailsToggle from "./ListComponents/DetailsToggle";
import JourneyTime from "./ListComponents/JourneyTime";
import TrainInfo from "./ListComponents/TrainInfo";
import IntermediateStops from "./ListComponents/IntermediateStops";
import SeatAvailability from "./ListComponents/SeatAvailability";

const List = ({ train, fromStation, toStation }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const startingStation = train?.starting_station || {};
  const terminatingStation = train?.terminating_station || {};

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg mb-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between items-center flex-col md:flex-row">
  <TrainInfo train={train} />
  <br />
  <DetailsToggle toggleDetails={toggleDetails} showDetails={showDetails} />
</div>


      {showDetails && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Starts From:</h3>
              <p className="text-md text-gray-600 flex items-center">
                <FaClock className="inline text-gray-500 mr-2" />
                {startingStation.name || "Unknown"} -{" "}
                {startingStation.departure_time || "N/A"}
              </p>
              {startingStation.code === fromStation.station_code && (
                <p className="text-blue-600 text-md">(Boarding)</p>
              )}
            </div>

            <JourneyTime
              train={train}
              fromStation={fromStation}
              toStation={toStation}
            />
          </div>

          <IntermediateStops
            train={train}
            fromStation={fromStation}
            toStation={toStation}
          />

          <div>
            <h3 className="text-lg font-medium text-gray-700">Terminates At:</h3>
            <p className="text-md text-gray-600 flex items-center">
              <FaClock className="inline text-gray-500 mr-2" />
              {terminatingStation.name || "Unknown"} -{" "}
              {terminatingStation.arrival_time || "N/A"}
            </p>
            {terminatingStation.code === toStation.station_code && (
              <p className="text-green-600 text-md">(Destination)</p>
            )}
          </div>

          <SeatAvailability train={train} />
        </div>
      )}
    </div>
  );
};

export default List;
