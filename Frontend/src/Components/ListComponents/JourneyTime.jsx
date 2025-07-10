const JourneyTime = ({ train, toStation, fromStation }) => {
  const calculateJourneyTime = () => {
    let fTime = null;
    let tTime = null;

    if (train.starting_station.code === fromStation.station_code) {
      fTime = train.starting_station.departure_time;
    }

    if (train.terminating_station.code === toStation.station_code) {
      tTime = train.terminating_station.arrival_time;
    }

    if (!fTime || !tTime) {
      train.intermediate_stations.forEach((stop) => {
        if (stop.code === fromStation.station_code) {
          fTime = stop.departure_time;
        }
        if (stop.code === toStation.station_code) {
          tTime = stop.arrival_time;
        }
      });
    }

    if (!fTime || !tTime) {
      return 'Invalid Stations';
    }

    const departureTime = new Date(`1970-01-01T${fTime}Z`); 
    const arrivalTime = new Date(`1970-01-01T${tTime}Z`);

    let timeDiff = arrivalTime - departureTime;

    if (timeDiff < 0) {
      timeDiff += 24 * 60 * 60 * 1000;  
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="mt-2">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Journey Time:</h3>
      <p className="text-md text-gray-600">{calculateJourneyTime()}</p>
    </div>
  );
};

export default JourneyTime;
