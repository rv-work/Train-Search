import { useContext } from "react";
import Input from "../Components/Input";
import context from "../Context/context";
import { toast } from "react-toastify";

const SearchForm = () => {
  const modeOptions = ["Train Only", "Bus Only", "Flight Only", "Mixed Mode"];
  const {
    fromStation,
    toStation,
    setDirect,
    setMulti,
    setLoading,
    setMultiLoading,
    setSearch,
    mode,
    date,
    setError,
    isSearching , 
    setIsSearching
  } = useContext(context);


  const handleSearch = async () => {
    setError("");

    if (!mode) return setError("Please select a mode.");
    if (["Bus Only", "Flight Only", "Mixed Mode"].includes(mode)) {
      return setError(`${mode} services are under development. Try other services.`);
    }
    if (!fromStation.station_code) return setError("Please select a source station.");
    if (!toStation.station_code) return setError("Please select a destination station.");
    if (!date) return setError("Please select a date.");

   
    setIsSearching(true);
    setLoading(true);
    setSearch(true);
    setMultiLoading(true);
    setDirect([]);
    setMulti([]);
    const eventSource = new EventSource(
      `https://train-ticket-rmn1.onrender.com/api/trains/search-trains?fromStation=${fromStation.station_code}&toStation=${toStation.station_code}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "directTrains") {
        setDirect(data.trains);
        toast.success("Direct Trains Fetched Successfully!!!");
        setLoading(false);
      } else if (data.type === "multi-train") {
        setMulti((prev) => [...prev, data.trains]);
      } else if (data.type === "done") {
        setIsSearching(false);
        setMultiLoading(false);
        toast.success("All Trains Fetched Successfully!!! 🎉🎉");

        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      setError("Error fetching train data. Please try again later.");
      console.error("Error fetching train data:", error);
      setIsSearching(false);
      setIsSearching(false);
      setLoading(false);
      setSearch(false);
      eventSource.close();
    };
  };

  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-stretch">
      <Input placeholder={"Train Only"} label={"Mode"} type={"select"} options={modeOptions} round={"left"} className="flex-1" />
      <Input placeholder={"City, place, location"} type={"text"} label={"From"} className="flex-1" />
      <Input placeholder={"City, place, location"} type={"text"} label={"To"} className="flex-1" />
      <Input placeholder={"Select Date"} label={"Date"} type={"date"} round={"right"} className="flex-1" />
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className={`bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-800 flex-1 sm:flex-none ${isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchForm;
