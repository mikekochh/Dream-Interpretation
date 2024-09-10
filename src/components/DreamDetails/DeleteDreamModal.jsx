import React from 'react';

const DeleteDreamModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Modal Title */}
        <h2 className="text-xl text-white font-semibold mb-4">Delete Dream</h2>
        
        {/* Confirmation Text */}
        <p className="text-white mb-6">Are you sure you want to delete your dream?</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {/* Cancel Button */}
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          
          {/* Delete Button */}
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={onDelete}
          >
            Delete Dream
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDreamModal;
