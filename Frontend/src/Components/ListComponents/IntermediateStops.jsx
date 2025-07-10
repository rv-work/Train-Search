import { FaTrain } from "react-icons/fa";

const IntermediateStops = ({ train, toStation, fromStation }) => {
  const stops = train?.intermediate_stations || [];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Intermediate Stops:</h3>
      <div className="bg-white divide-y divide-gray-200 border border-gray-300 rounded-lg">
        {stops.length > 0 ? (
          stops.map((stop, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-4 py-3 hover:bg-blue-50 transition duration-200"
              role="listitem" // For screen readers
            >
              <div>
                <p className="text-md text-gray-800">{`${stop.name} (${stop.code})`}</p>
                {stop.code === fromStation.station_code && (
                  <span className="text-sm text-blue-600">(Boarding)</span>
                )}
                {stop.code === toStation.station_code && (
                  <span className="text-sm text-green-600">(Destination)</span>
                )}
                <p className="text-sm text-gray-600">
                  Arrival: {stop.arrival_time} | Departure: {stop.departure_time}
                </p>
              </div>
              <FaTrain className="text-blue-500" />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-4">No intermediate stops available.</p>
        )}
      </div>
    </div>
  );
};

export default IntermediateStops;
