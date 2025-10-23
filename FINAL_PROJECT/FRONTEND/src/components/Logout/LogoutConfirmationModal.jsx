import React from 'react';

const LogoutConfirmationModal = ({ isVisible, onConfirm, onCancel }) => {
  // If the modal is not visible, return null to render nothing
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-xs text-center">
        <p className="text-lg font-semibold text-gray-800 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-around space-x-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 me-3 rounded text-base font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          >
            Logout
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded text-base font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
