const DetailsToggle = ({ toggleDetails, showDetails }) => {
  return (
    <button
      onClick={toggleDetails}
      className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-medium shadow-md transition duration-300"
    >
      {showDetails ? "Hide Details" : "See Details"}
    </button>
  );
};

export default DetailsToggle;
