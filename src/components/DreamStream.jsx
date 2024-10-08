"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const DreamItem = ({ dream }) => {
  const [showFullText, setShowFullText] = useState(false);
  const router = useRouter();

  const handleReadMore = () => {
    setShowFullText(true);
  };

  return (
    <div className="bg-[rgba(128,128,128,0.1)] rounded-xl overflow-hidden shadow-2xl mb-4 w-full md:w-1/2 mx-auto p-2">
      <Image
        src={dream.imageURL}
        alt={dream.imageURL}
        className="w-full h-auto object-cover rounded-lg"
        layout="responsive"
        width={1}
        height={1}
      />
      <p className="mt-2 golden-ratio-2">{new Date(dream.dreamDate).toLocaleDateString()}</p>
      <div className="p-4 pt-0">
        
        <p className="text-white">
          {showFullText ? dream.dream : dream.dream.substring(0, 200)}
          {!showFullText && dream.dream.length > 200 && (
            <>
              ...{' '}
              <button
                onClick={handleReadMore}
                className="text-blue-500 bg-transparent border-none p-0 cursor-pointer"
              >
                read more
              </button>
            </>
          )}
        </p>
        <div className="text-center">
          <button
            onClick={() => router.push("/dreamDetails?dreamID=" + dream._id)}
            className="start-button"
          >
            View Dream
          </button>
        </div>
      </div>
    </div>
  );
};

const DreamStream = () => {
  const [dreamStreamSymbols, setDreamStreamSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const symbolsRef = useRef([]); // Use refs to target the elements for animation
  const [dreamStream, setDreamStream] = useState([]);

  useEffect(() => {
    const fetchDreamStreamSymbols = async () => {
      const res = await axios.get('/api/dream/symbols/dreamStreamSymbols');
      setDreamStreamSymbols(res.data);
    };

    const fetchPublicDreams = async () => {
      const res = await axios.get('/api/dream/dreamStream');
      setDreamStream(res.data.dreams);
    };

    fetchDreamStreamSymbols();
    fetchPublicDreams();
  }, []);

  return (
    <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
      <h2 className="text-center mb-6 gradient-title-text golden-ratio-4">Dream Stream</h2>


      {/* Dream Stream section */}
      <div className="mt-8">
        {dreamStream.map((dream) => (
          <DreamItem key={dream._id} dream={dream} />
        ))}
      </div>

      {/* Modal */}
      {selectedSymbol && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSelectedSymbol(null)}
          ></div>

          {/* Modal Content */}
          <div className="bg-white rounded-lg p-8 z-50 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              {selectedSymbol.symbol}
            </h2>
            <p className="text-gray-700 mb-6">{selectedSymbol.meaning}</p>
            <p className="text-gray-600">Dreamt {selectedSymbol.count} times</p>
            <button
              onClick={() => setSelectedSymbol(null)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamStream;
