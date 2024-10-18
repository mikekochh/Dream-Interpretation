import { NextResponse } from 'next/server';
import View from '../../../../../../models/views';
import { connectMongoDB } from '../../../../../../lib/mongodb';

// Helper function to calculate start and end time based on the timeframeID
function getTimeFrame(timeframeID) {
    const currentDate = new Date();
    let startTime, endTime;

    switch (Number(timeframeID)) {
        case 0: // Today
            startTime = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
            endTime = new Date().toISOString();
            break;
        case 1: // Last 7 days
            startTime = new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString();
            endTime = new Date().toISOString();
            break;
        case 2: // Last 30 days
            startTime = new Date(currentDate.setDate(currentDate.getDate() - 30)).toISOString();
            endTime = new Date().toISOString();
            break;
        case 3: // Last 90 days
            startTime = new Date(currentDate.setDate(currentDate.getDate() - 90)).toISOString();
            endTime = new Date().toISOString();
            break;
        case 4: // Last year
            startTime = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString();
            endTime = new Date().toISOString();
            break;
        case 5: // All Time (no time restriction)
            startTime = null;
            endTime = null;
            break;
        default: // Default to today if no valid timeframeID is provided
            startTime = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
            endTime = new Date().toISOString();
            break;
    }

    return { startTime, endTime };
}

export async function GET(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        const pathname = req.nextUrl.pathname;
        const timeframeID = pathname.split('/').pop();

        // Get start_time and end_time based on the timeframeID
        const { startTime, endTime } = getTimeFrame(timeframeID);

        // Build the MongoDB query
        const query = {
            userID: { $ne: null } // Ensure userID is not null
        };

        // Apply the timeframe filter only if it's not "All Time"
        if (startTime && endTime) {
            query.view_date = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }

        // Fetch views with a lookup to the users table
        const views = await View.aggregate([
            {
                $match: query // Apply the query based on the timeframe and userID
            },
            {
                $addFields: {
                    userIDObject: { $toObjectId: "$userID" } // Convert userID to ObjectId
                }
            },
            {
                $lookup: {
                    from: 'users', // The collection name for the users table
                    localField: 'userIDObject', // Use the newly converted ObjectId field
                    foreignField: '_id', // The _id field in the users table (which is ObjectId)
                    as: 'user' // The alias for the joined data
                }
            },
            {
                $unwind: {
                    path: '$user', // Unwind the user data to extract individual user information
                    preserveNullAndEmptyArrays: true // In case there's no matching user, return null
                }
            },
        ]);

        return NextResponse.json({ data: views });
    } catch (error) {
        console.error('Error fetching views data: ', error);
        return NextResponse.json({ error: error.message });
    }
}



