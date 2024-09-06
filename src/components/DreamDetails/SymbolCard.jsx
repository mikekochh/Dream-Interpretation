import { useState } from "react";

const SymbolCard = ({ symbol }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Symbol Card */}
      <div
        onClick={toggleModal}
        className="relative p-2 bg-gradient-to-r from-purple-600 to-indigo-900 rounded-lg shadow-lg 
                   text-white w-32 h-fit text-center hover:scale-105 transition-transform cursor-pointer"
      >
        {/* White Pulse Animation in Top-Right Corner */}
        <div className="absolute top-0 right-0 mt-[-4px] mr-[-4px] h-2 w-2 bg-white rounded-full shadow-lg animate-pulse"></div>

        <span className="text-md font-semibold">
          {symbol.symbolID.symbol} <br />
          <span className="text-xs text-gray-300">Click to learn more</span>
        </span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="relative w-11/12 md:w-1/3 bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-2xl text-white">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              X
            </button>

            {/* Modal Content */}
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">{symbol.symbolID.symbol}</h2>
              {/* Ensure text wraps and doesn't overflow */}
              <p className="text-lg break-words break-normal whitespace-normal">
                {symbol.symbolID.meaning}
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default SymbolCard;
