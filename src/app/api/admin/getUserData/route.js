

// at the top will be the amount of users in the table

import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

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

        // Extract query parameters from the request URL
        const { searchParams } = new URL(req.url);
        const timeframeID = searchParams.get('timeframeID'); // Get the timeframeID from the query

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

        // Fetch users from the database based on the query
        const users = await User.find(query);

        return NextResponse.json({ data: users });
    } catch (error) {
        console.error('Error fetching user data: ', error);
        return NextResponse.json({ error: error.message });
    }
}

