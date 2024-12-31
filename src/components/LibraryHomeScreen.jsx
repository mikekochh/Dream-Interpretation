"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { dreamSymbolsState } from '@/recoil/atoms';
import LoadingComponent from './LoadingComponent';

const LibraryHomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedSymbols, setDisplayedSymbols] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const maxSymbols = 5;

    const dreamSymbols = useRecoilValue(dreamSymbolsState);

    const loadSymbols = () => {
        const query = searchQuery.toLowerCase();
        const filteredSymbols = dreamSymbols.filter(symbol => 
            symbol.symbol.toLowerCase().includes(query)
        );
        const endIndex = maxSymbols * currentPage;
        const symbolsToDisplay = filteredSymbols.slice(0, endIndex);
        setDisplayedSymbols(symbolsToDisplay);
    }

    useEffect(() => {
        if (dreamSymbols && dreamSymbols.length > 0) {
            loadSymbols();
        }
    }, [searchQuery, currentPage, dreamSymbols]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    }

    const handleViewMoreClick = () => {
        setCurrentPage(prevPage => prevPage + 1);
    }

    const query = searchQuery.toLowerCase();
    const filteredSymbols = dreamSymbols.filter(symbol =>
        symbol.symbol?.toLowerCase().includes(query)
    );
    const canViewMore = displayedSymbols.length < filteredSymbols.length;

    return (
        <div className="md:w-2/3 md:mx-auto md:px-0 md:py-8 px-3 py-8 bg-transparent">
            <h3 className="text-center font-thin golden-ratio-2 text-gray-200">2000+ Dream Symbols</h3>
            <h2 className="text-center gradient-title-text golden-ratio-4">Dream Dictionary</h2>
            <h3 className="text-center mb-6 golden-ratio-2 text-gray-100">
                Search our dream dictionary for symbols that appeared in your dream to find out the meaning behind them
            </h3>
            <div className="px-4 md:w-2/3 mx-auto mt-6">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search for dream symbols..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full p-4 text-lg text-black border border-gray-300 rounded-xl"
                />
            </div>
            {dreamSymbols.length ? (
                <div className="mt-8">
                    <ul className="mt-4 space-y-4">
                        {displayedSymbols.map((symbol) => (
                            <Link href={`/dream-symbols/${symbol.sanitizedSymbol}`} key={symbol._id}>
                                <li
                                    className="p-4 border text-white border-gray-300 rounded-xl bg-white bg-opacity-10 shadow-2xl mt-4 cursor-pointer transition-transform duration-500 hover:scale-105 hover:bg-opacity-20"
                                >
                                    <h4 className="font-bold text-lg">{symbol.symbol}</h4>
                                    <p className="mt-2">{symbol.short_meaning}</p>
                                    <p className="mt-2 text-gray-100 underline">Click to learn more</p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                <LoadingComponent loadingText={"Loading Dream Symbols"} altScreen={true} />
            )}
        </div>
    );
};

export default LibraryHomeScreen;
