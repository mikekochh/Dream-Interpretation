import { useState } from 'react';
import Image from 'next/image';
import ViewInterpretation from './ViewInterpretation'; // Assuming ViewInterpretation is in the same folder

const OracleInterpretations = ({ interpretation, oracle }) => {
  const [showInterpretationModal, setShowInterpretationModal] = useState(false);

  const openInterpretationModal = () => {
    setShowInterpretationModal(true);
  };

  const closeInterpretationModal = () => {
    setShowInterpretationModal(false);
  };

  return (
    <div className="flex flex-col cursor-pointer p-2">
      {oracle && (
        <div className="w-14 h-14 rounded-full border-gold-small flex items-center justify-center bg-black bg-opacity-50">
          <Image
            src={oracle.oraclePicture}
            alt={`Oracle ${oracle.oracleName}`}
            className="w-full h-full rounded-full object-cover"
            width={100}
            height={100}
            onClick={openInterpretationModal}
          />
        </div>
      )}
      <p className="mt-2 text-sm text-gold">{oracle ? oracle.oracleName : 'Unknown Oracle'}</p>

      {/* Modal for viewing interpretation */}
      <ViewInterpretation
        interpretation={interpretation}
        oracle={oracle}
        isOpen={showInterpretationModal}
        onClose={closeInterpretationModal}
      />
    </div>
  );
};

export default OracleInterpretations;
