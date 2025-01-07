import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { dreamSymbolsState } from '@/recoil/atoms';

const FunFacts = () => {
    const dreamSymbols = useRecoilValue(dreamSymbolsState);
    const [currentSymbol, setCurrentSymbol] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!dreamSymbols || dreamSymbols.length === 0) return;

        const changeSymbol = () => {
            setIsAnimating(true);

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * dreamSymbols.length);
                setCurrentSymbol(dreamSymbols[randomIndex]);
                setIsAnimating(false);
            }, 500); // Animation duration
        };

        // Initialize with a symbol
        changeSymbol();

        const interval = setInterval(changeSymbol, 7000); // Change every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [dreamSymbols]);

    return (
        <div className="relative inline-block text-center p-4">
            <div
                className={`transition-opacity duration-500 ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
            >
                {currentSymbol ? (
                    <>
                        <h2 className="text-xl font-bold">{currentSymbol.symbol}</h2>
                        <p className="text-sm text-gray-400">{currentSymbol.short_meaning}</p>
                    </>
                ) : (
                    <div/>
                )}
            </div>
        </div>
    );
};

export default FunFacts;
