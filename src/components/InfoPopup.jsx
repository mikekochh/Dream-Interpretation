import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InfoPopup = ({ icon, infoText }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <FontAwesomeIcon icon={icon} className="ml-2 cursor-pointer" onClick={handleToggle} />
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative w-3/4 max-w-2xl">
                        <button
                            className="absolute top-2 right-2 text-gray-700 hover:text-black"
                            onClick={handleToggle}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div className="text-black">{infoText}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoPopup;
