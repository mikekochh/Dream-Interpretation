'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { dreamSymbolsState } from '@/recoil/atoms';

const DreamSymbolForm = () => {
    const pathname = usePathname();
    const router = useRouter();
    const sanitizedSymbol = pathname.split('/').pop();

    let symbolNotFound = false;

    const dreamSymbols = useRecoilValue(dreamSymbolsState);
    
    const symbolData = dreamSymbols.find(dreamSymbol => dreamSymbol.sanitizedSymbol === sanitizedSymbol);
    
    if (!symbolData) {
        symbolNotFound = true;
    }

    if (symbolNotFound) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center p-8 max-w-md bg-white bg-opacity-10 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Symbol Not Found</h1>
                    <p className="text-lg text-gray-300 mb-6">
                        It seems we couldn&apos;t find the symbol you&apos;re looking for. Perhaps it&apos;s a rare or unexplored dream sign.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content text-white p-8">
            <div className="max-w-4xl mx-auto bg-white bg-opacity-10 p-6 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-center">{symbolData.symbol}</h1>
                <p className="mt-4 text-lg text-gray-300">{symbolData.detailed_meaning}</p>
                {symbolData.relatedThemes && (
                    <p className="mt-6 text-gray-400 italic">
                        Related themes: {symbolData.relatedThemes.join(', ')}
                    </p>
                )}
                <button
                    className="mt-8 px-6 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default DreamSymbolForm;
