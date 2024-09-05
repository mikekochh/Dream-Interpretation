import { useState } from 'react';

const AddNewInterpretationModal = ({ oracles, isOpen, onClose, onInterpret }) => {
  const [selectedOracle, setSelectedOracle] = useState('');

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleSelectChange = (e) => {
    setSelectedOracle(e.target.value);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-15 text-white">
      <div className="rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto bg-black hide-scrollbar">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Select an Oracle to Interpret Your Dream
        </h2>

        {/* Oracle Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="oracleSelect" className="block text-lg font-semibold mb-2">
            Choose Oracle
          </label>
          <select
            id="oracleSelect"
            className="w-full p-2 border rounded-lg text-black"
            value={selectedOracle}
            onChange={handleSelectChange}
          >
            <option value="" disabled>Select an Oracle</option>
            {oracles.map((oracle) => (
              <option key={oracle.oracleID} value={oracle.oracleID}>
                {oracle.oracleName} - {oracle.speciality}
              </option>
            ))}
          </select>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleInterpret}
          >
            Interpret Dream
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewInterpretationModal;
