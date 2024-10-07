import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LibraryForm = () => {
  const [dreamSymbols, setDreamSymbols] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedSymbols, setDisplayedSymbols] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const symbolsPerPage = 10;

  useEffect(() => {
    const retrieveDreamSymbols = async () => {
      const res = await axios.get('/api/dream/symbols');
      setDreamSymbols(res.data);
    };

    retrieveDreamSymbols();
  }, []);

  // Function to filter and set displayed symbols
  const loadSymbols = () => {
    const query = searchQuery.toLowerCase();
    const filteredSymbols = dreamSymbols.filter(symbol =>
      symbol.symbol.toLowerCase().includes(query)
    );
    const endIndex = symbolsPerPage * currentPage;
    const symbolsToDisplay = filteredSymbols.slice(0, endIndex);
    setDisplayedSymbols(symbolsToDisplay);
  };

  // Effect to load symbols when searchQuery, currentPage, or dreamSymbols change
  useEffect(() => {
    loadSymbols();
  }, [searchQuery, currentPage, dreamSymbols]);

  // Handler for search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handler for "View More" button click
  const handleViewMoreClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  // Determine whether to show the "View More" button
  const query = searchQuery.toLowerCase();
  const filteredSymbols = dreamSymbols.filter(symbol =>
    symbol.symbol.toLowerCase().includes(query)
  );
  const canViewMore = displayedSymbols.length < filteredSymbols.length;

  return (
    <div className="main-content md:w-2/3 mx-auto hide-scrollbar">
      {/* Search Bar */}
      <p className="text-center golden-ratio-5 gradient-title-text pb-2">Library</p>
      <p className="text-center golden-ratio-2 mb-4 text-white">
        Explore our library of dream symbols to gain additional understanding of your dreams.
      </p>
      <div className="px-4 md:w-2/3 mx-auto">
        <input
          type="text"
          id="search-input"
          placeholder="Search for dream symbols..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-full p-4 text-lg border border-gray-300 rounded-xl"
        />
      </div>

      {/* Symbols List */}
      <div className="p-4">
        {displayedSymbols.map((symbol, index) => (
          <div className="border-b border-gray-200 py-4" key={index}>
            <div className="text-2xl font-bold text-gray-100">{symbol.symbol}</div>
            <div className="text-md text-gray-400 mt-1">{symbol.meaning}</div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {canViewMore && (
        <div className="text-center">
          <button
            className="secondary-button"
            onClick={handleViewMoreClick}
          >
            View More
          </button>
        </div>

      )}
      <div className="image-container text-center mt-4">
        <Image src="/mandela.webp" alt="Mandela" width={500} height={500} className="mandela-image" />
      </div>
    </div>
  );
};

export default LibraryForm;
