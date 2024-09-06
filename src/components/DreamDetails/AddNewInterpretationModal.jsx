import { useState } from 'react';
import Image from 'next/image';

const AddNewInterpretationModal = ({ oracles, isOpen, onClose, onInterpret }) => {
  const [selectedOracle, setSelectedOracle] = useState('');

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleCardClick = (oracleID) => {
    setSelectedOracle(oracleID);
  };

  const handleClose = () => {
    setSelectedOracle(null);
    onClose();
  };

  const handleInterpret = () => {
    if (selectedOracle) {
      onInterpret(selectedOracle); // Pass selected oracle back to parent for interpreting the dream
      onClose(); // Close the modal after interpreting
    } else {
      alert('Please select an oracle before interpreting the dream.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="rounded-lg w-full max-w-lg lg:max-w-4xl p-4 relative max-h-[80vh] h-auto overflow-y-auto bg-gray-900 bg-opacity-90 shadow-2xl text-white hide-scrollbar">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-3xl"
          onClick={handleClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select an Oracle to Interpret Your Dream
        </h2>

        {/* Oracle Cards */}
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide lg:grid lg:grid-cols-3 py-4 px-4">
          {oracles.map((oracle) => (
            <div
              key={oracle.oracleID}
              className={`border p-4 rounded-lg cursor-pointer transform transition-all duration-300 flex-shrink-0 w-60 
                ${selectedOracle === oracle.oracleID ? 'border-blue-500 scale-105 bg-darkblue' : 'border-gray-500 bg-darkerblue'}`}
              onClick={() => handleCardClick(oracle.oracleID)}
            >
              <Image
                src={oracle.oraclePicture}
                alt={oracle.oracleName}
                className="w-full h-40 object-cover rounded-md mb-4"
                width={100}
                height={100}
                unoptimized={true}
              />
              <h3 className="text-lg font-semibold mb-2 text-center break-words">{oracle.oracleName}</h3>
              <p className="text-sm text-center break-words">{oracle.oracleDescriptionShort}</p>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              selectedOracle
                ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            onClick={handleInterpret}
            disabled={!selectedOracle}
          >
            Interpret Dream
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewInterpretationModal;
