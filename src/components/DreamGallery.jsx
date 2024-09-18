import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowDownShortWide, faV, faSortDown, faAngleDown } from "@fortawesome/free-solid-svg-icons";

const DreamGallery = () => {
  const [dreamGallerySymbols, setDreamGallerySymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  useEffect(() => {
    const fetchDreamGallerySymbols = async () => {
      const res = await axios.get('/api/dream/symbols/dreamGallerySymbols');
      setDreamGallerySymbols(res.data);
    };

    fetchDreamGallerySymbols();
  }, []);

  return (
    <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
        <h2 className="text-center mb-6 gradient-title-text golden-ratio-4">Dream Gallery</h2>
        <div className="flex items-center space-x-2">
            <h3 className="golden-ratio-2 gradient-title-text font-bold">Top Dream Symbols This Week</h3>
            <FontAwesomeIcon
                icon={faAngleDown}
                alt="close"
                className="text-white"
            />
        </div>


      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex md:grid grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap md:whitespace-normal">
        {dreamGallerySymbols.map((symbol, index) => (
          <div
            key={`${symbol.id}-${index}`}
            onClick={() => setSelectedSymbol(symbol)}
            className="inline-block md:block p-4 cursor-pointer border border-white rounded-xl bg-transparent hover:bg-gray-500 hover:bg-opacity-30 transition-colors mx-2 md:mx-0"
            style={{ minWidth: '200px' }} // Ensures all symbols are in a row on mobile
          >
            <h3 className="font-semibold gradient-title-text golden-ratio-2">
              {index + 1}. {symbol.symbol}
            </h3>
            <p className="text-gray-400">Dreamt {symbol.count} times</p>
          </div>
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
            <h2 className="text-2xl font-bold mb-4 text-black text-center">{selectedSymbol.symbol}</h2>
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

export default DreamGallery;
