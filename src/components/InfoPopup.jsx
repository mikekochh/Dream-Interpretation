import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const InfoPopup = ({ icon, infoText, infoTitle, hasAccess }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const formatTextWithLineBreaks = (text) => {
        return text.split('\n').join('<br/>');
    };

    return (
        <div className="relative inline-block">
            <FontAwesomeIcon icon={icon} className="ml-2 cursor-pointer golden-ratio-1" onClick={handleToggle} />
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative w-3/4 max-w-2xl">
                        <button
                            className="absolute top-2 right-2 text-gray-700 hover:text-black"
                            onClick={handleToggle}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div 
                            className="text-center font-bold mb-2 text-black" 
                            dangerouslySetInnerHTML={{ __html: formatTextWithLineBreaks(infoTitle) }}
                        ></div>
                        <div className="text-black">{infoText}</div>
                        {!hasAccess && (
                            <div className="text-black font-bold mt-4">
                                Create an account to gain access to all Dream Oracles
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoPopup;
