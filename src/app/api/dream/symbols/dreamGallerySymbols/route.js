import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import UserDreamSymbol from '../../../../../../models/userDreamSymbols';
import DreamSymbol from '../../../../../../models/dreamSymbols';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Get the current date and time in UTC
        const now = new Date();

        // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = now.getUTCDay();

        // Calculate the date of the most recent previous Sunday at midnight UTC
        const diffToSunday = dayOfWeek; // Number of days since last Sunday
        const lastSundayMidnight = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - diffToSunday,
            0, 0, 0
        ));

        console.log("lastSundayMidnight: ", lastSundayMidnight);
        console.log("now: ", now);

        // Aggregate the user dream symbols for the week using analysisDate
        const result = await UserDreamSymbol.aggregate([
            // Match documents where analysisDate is from lastSundayMidnight to now
            {
                $match: {
                    analysisDate: {
                        $gte: lastSundayMidnight,
                        $lte: now,
                    },
                },
            },
            // Group by symbolID and count occurrences
            { $group: { _id: '$symbolID', count: { $sum: 1 } } },
            // Sort by count in descending order
            { $sort: { count: -1 } },
            // Limit to top 5 symbols
            { $limit: 12 },
            // Lookup corresponding dream symbol data
            {
                $lookup: {
                    from: DreamSymbol.collection.name, // Name of the dream symbols collection
                    localField: '_id',                 // symbolID from UserDreamSymbol
                    foreignField: '_id',               // _id in DreamSymbol
                    as: 'symbolData',                  // Output array field
                },
            },
            // Unwind the symbolData array to an object
            { $unwind: '$symbolData' },
            // Project the desired fields
            {
                $project: {
                    id: '$symbolData._id',
                    symbol: '$symbolData.symbol',
                    meaning: '$symbolData.meaning',
                    count: 1,
                },
            },
        ]);

        console.log("result: ", result);

        return NextResponse.json(result);
    } catch (error) {
        console.log('Error getting user dream symbols:', error);
        return NextResponse.error();
    }
}
