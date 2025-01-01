import React from 'react';
import Link from 'next/link';

const RelatedSymbolsComponent = ({ symbols }) => {
    return (
        <div className="mt-8 p-4 rounded-lg shadow">
            <h3 className="text-3xl font-light mb-4 text-white text-center">Related Dream Symbols</h3>
            <div className="flex flex-wrap gap-2">
                {symbols.map((symbol, index) => {
                    // Replace spaces with dashes in the symbol
                    const formattedSymbol = symbol.replace(/\s+/g, '-').toLowerCase();
                    return (
                        <Link
                            key={index}
                            href={`/dream-dictionary/${formattedSymbol}`}
                            passHref
                            className="p-4 border text-white border-gray-300 rounded-xl bg-white bg-opacity-10 shadow-2xl cursor-pointer transition-transform duration-500 hover:scale-105 hover:bg-opacity-20"
                        >
                            <p className="capitalize font-bold">
                                {symbol}
                            </p>
                            <p className="text-sm underline">Click to learn more</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedSymbolsComponent;
