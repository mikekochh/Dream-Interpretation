import { useState, useEffect } from 'react';
import Image from 'next/image';
import ViewInterpretation from './ViewInterpretation'; // Assuming ViewInterpretation is in the same folder

const OracleInterpretations = ({ interpretation, oracle, openInterpretation, updateInterpretationFeedback }) => {
  const [showInterpretationModal, setShowInterpretationModal] = useState(false);

  useEffect(() => {
    if (openInterpretation) {
      openInterpretationModal();
    }
  }, [])

  const openInterpretationModal = () => {
    setShowInterpretationModal(true);
  };

  const closeInterpretationModal = () => {
    setShowInterpretationModal(false);
  };

  return (
    <div>
      <div 
          className="flex flex-col md:flex-row md:items-center md:bg-gray-700 md:bg-opacity-50 md:rounded-lg cursor-pointer p-2"
          onClick={openInterpretationModal}
      >
        {oracle && (
          <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-opacity-50 md:mr-4">
            <Image
              src={oracle.oraclePicture}
              alt={`Oracle ${oracle.oracleName}`}
              className="rounded-full object-cover border-gold-small"
              width={100}
              height={100}
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-red-400 rounded-full shadow-lg animate-pulse"></div>
          </div>

        )}
        <div className="text-center md:text-left">
          <p className="text-sm hidden md:flex text-gold">{oracle ? oracle.oracleName : 'Unknown Oracle'}</p>
          <p className="text-sm md:hidden text-gold mt-1">{oracle ? oracle.oracleShortName : 'Unknown Oracle'}</p>
        </div>
      </div>
      <ViewInterpretation
          interpretation={interpretation}
          oracle={oracle}
          isOpen={showInterpretationModal}
          onClose={closeInterpretationModal}
          updateInterpretationFeedback={updateInterpretationFeedback}
        />
    </div>
  );
};

export default OracleInterpretations;
