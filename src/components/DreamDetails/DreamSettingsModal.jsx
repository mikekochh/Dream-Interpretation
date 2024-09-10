import React from 'react';

const DreamSettingsModal = ({ isOpen, onClose, onEditDream, onDeleteDream }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Modal Title */}
        <h2 className="text-xl text-white text-center font-semibold mb-4 p-6 pb-4">Dream Settings</h2>
        
        {/* Edit Dream Button */}
        <button
          className="w-full py-4 text-white bg-gray-900 hover:bg-gray-800 border-b border-gray-100 border-1"
          onClick={onEditDream}
        >
          Edit Dream
        </button>
        
        {/* Delete Dream Button */}
        <button
          className="w-full py-4 text-white bg-gray-900 hover:bg-gray-800"
          onClick={onDeleteDream}
        >
          Delete Dream
        </button>
      </div>
    </div>
  );
};

export default DreamSettingsModal;
