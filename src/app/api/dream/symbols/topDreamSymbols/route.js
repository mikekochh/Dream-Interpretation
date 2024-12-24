import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamSymbol from '../../../../../../models/dreamSymbols';
import UserDreamSymbol from '../../../../../../models/userDreamSymbols';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Fetch all UserDreamSymbol records
        const userDreamSymbols = await UserDreamSymbol.find();

        // Count occurrences of each symbolID
        const symbolCounts = userDreamSymbols.reduce((acc, item) => {
            acc[item.symbolID] = (acc[item.symbolID] || 0) + 1;
            return acc;
        }, {});

        console.log("symbolCounts: ", symbolCounts);

        // Get the top 10 symbolIDs based on quantity
        const topSymbolIDs = Object.entries(symbolCounts)
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .slice(0, 10) // Take the top 10
            .map(([symbolID]) => symbolID); // Extract only symbolID

        console.log("topSymbolIDs: ", topSymbolIDs);

        // Fetch the corresponding dream symbols from the DreamSymbol table
        const topDreamSymbols = await DreamSymbol.find({ _id: { $in: topSymbolIDs } });

        console.log("topDreamSymbols: ", topDreamSymbols);

        // Format the response with symbol counts included
        const response = topDreamSymbols.map(symbol => ({
            ...symbol.toObject(),
            count: symbolCounts[symbol.symbolID],
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error retrieving top dream symbols: ', error);
        return NextResponse.error(error);
    }
}
