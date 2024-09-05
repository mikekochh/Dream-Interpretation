import { useState } from 'react';

const EditDreamModal = ({ dream, isOpen, onClose, onSave }) => {
  const [dreamText, setDreamText] = useState(dream.dream || '');

  const handleSave = () => {
    // Call the onSave function passed as a prop with the updated dream text
    onSave(dreamText);
    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
      <div className="bg-black rounded-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl text-white font-semibold mb-4">Edit Dream</h2>
        <textarea
          className="w-full p-2 rounded-lg text-white bg-gray-900"
          rows="6"
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Dream
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDreamModal;
