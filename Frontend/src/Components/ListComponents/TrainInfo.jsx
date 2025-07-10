import { FaTrain } from "react-icons/fa";

const TrainInfo = ({ train }) => {
  const { starting_station, terminating_station, train_name, train_number } = train;

  return (
    <div>
      <div className="flex">
        <p className="text-lg font-semibold text-gray-800">
          {`${starting_station?.name || "Unknown"} (${starting_station?.code || "N/A"})`}
        </p>
        <span className="text-xl">{" -> "}</span>
        <p className="text-lg font-semibold text-gray-800">
          {`${terminating_station?.name || "Unknown"} (${terminating_station?.code || "N/A"})`}
        </p>
      </div>
      <h3 className="text-2xl text-gray-700 mt-1">
        <FaTrain className="inline text-blue-500 mr-2" />
        Train: <span className="font-bold">{train_name || "Unknown Train"}</span> ({train_number || "N/A"})
      </h3>
    </div>
  );
};

export default TrainInfo;
