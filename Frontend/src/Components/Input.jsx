import { useContext, useState } from "react";
import Trains from "../assets/Trains/Trains";
import context from "../Context/context";

const Input = ({ placeholder, label, round, type, options = [] }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { setFromStation, setToStation, setMode, setDate , setSearch , setIsSearching } = useContext(context);

  let roundClasses = "";
  if (round === "left") {
    roundClasses = "rounded-tl-lg rounded-bl-lg";
  } else if (round === "right") {
    roundClasses = "rounded-tr-lg rounded-br-lg";
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearch(false);
    setIsSearching(false);

    if (label === "Mode") setMode(value);
    if (label === "Date") setDate(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else if (label === "From" || label === "To") {
      const filteredTrains = Trains.filter(
        (train) =>
          train.station_name.toLowerCase().includes(value.toLowerCase()) ||
          train.station_code.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredTrains);
      setShowDropdown(filteredTrains.length > 0);
    }
  };

  const handleSuggestionClick = (train) => {
    setInputValue(`${train.station_code} - ${train.station_name}`);
    if (label === "From") setFromStation(train);
    if (label === "To") setToStation(train);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (label === "Mode") setMode(value);
    if (label === "Date") setDate(value);
  };

  return (
    <div
      className={`relative w-full sm:w-64 bg-white ${roundClasses} shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500`}
    >
      <div className="py-2 px-4">
        <label htmlFor={label} className="text-gray-600 block mb-1">
          {label}
        </label>
        {type === "select" ? (
          <select
            id={label}
            className="w-full rounded-md text-gray-600 focus:outline-none"
            value={inputValue}
            onChange={handleSelectChange}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option, key) => (
              <option key={key} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input
              id={label}
              className="w-full rounded-md text-gray-600 focus:outline-none"
              type={type}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
            />
            {showDropdown && (
              <ul className="text-black absolute z-10 bg-white border border-gray-200 w-full rounded-md shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((train, index) => (
                  <li
                    key={index}
                    className="py-2 px-4 hover:bg-blue-600 hover:text-white cursor-pointer"
                    onClick={() => handleSuggestionClick(train)}
                  >
                    {train.station_code} - {train.station_name}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
