
import { NextResponse } from 'next/server';
import User from '../../../../../../models/user';
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
        const query = {};

        // Apply the timeframe filter only if it's not "All Time"
        if (startTime && endTime) {
            query.createdAt = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }

        // Fetch users and their views from the database
        console.log('Executing MongoDB aggregate query...');
        const users = await User.aggregate([
            {
                $match: query // Apply the query to filter users based on the timeframe
            },
            {
                $lookup: {
                    from: 'views', // The collection name for the views table
                    localField: '_id', // The _id field in the users table
                    foreignField: 'userID', // The userID field in the views table
                    as: 'views' // The alias for the joined data
                }
            },
            {
                $addFields: {
                    viewsCount: { $size: "$views" } // Add a new field for the number of views
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return NextResponse.json({ data: users });
    } catch (error) {
        console.error('Error fetching user data: ', error);
        return NextResponse.json({ error: error.message });
    }
}