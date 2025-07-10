import { useState } from "react";
import { Link } from "react-router-dom";

const SeatAvailability = ({ train }) => {
  const [selectedClass, setSelectedClass] = useState(null);

  const toggleSeatAvailability = (classType) => {
    setSelectedClass(selectedClass === classType ? null : classType);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "text-green-600";
      case "RAC":
        return "text-yellow-500";
      case "Waiting":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="mt-6 flex-1">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Available Seats:</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-2">
            {Object.entries(train.seat_availability || {}).length === 0 ? (
              <p className="text-gray-500">No seat availability data available.</p>
            ) : (
              Object.entries(train.seat_availability || {})
                .filter(([classType, details]) => details._id)
                .map(([classType, details]) => (
                  <button
                    key={classType}
                    onClick={() => toggleSeatAvailability(classType)}
                    className={`px-4 py-2 rounded-md shadow-md font-medium transition duration-300 ${
                      selectedClass === classType
                        ? "bg-blue-100 border border-blue-400"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    aria-label={`Toggle seat availability for ${classType}`}
                  >
                    {selectedClass === classType ? (
                      <span>
                        {classType}:{" "}
                        <span
                          className={`font-bold ${getStatusClass(details.status)}`}
                        >
                          {details.status}
                        </span>{" "}
                        -{" "}
                        <span
                          className={`font-bold ${getStatusClass(details.status)}`}
                        >
                          {details.available}
                        </span>
                      </span>
                    ) : (
                      classType
                    )}
                  </button>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto">
        <Link
          to="https://www.irctc.co.in/nget/train-search"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-medium shadow-md transition duration-300"
          aria-label="Book train tickets on IRCTC"
        >
          Book Ticket
        </Link>
      </div>
    </div>
  );
};

export default SeatAvailability;
