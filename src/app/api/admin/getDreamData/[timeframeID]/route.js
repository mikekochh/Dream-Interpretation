import { NextResponse } from 'next/server';
import Dream from '../../../../../../models/dream';
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

        const { startTime, endTime } = getTimeFrame(timeframeID);
        
        const query = {};
        
        // Apply the timeframe filter only if it's not "All Time"
        if (startTime && endTime) {
            query.dreamDate = {
                $gte: new Date(startTime),
                $lte: new Date(endTime)
            };
        }
        
        // query.userID = { $ne: '65639dbb9811fa19c4dca43d' };
        
        
        // Fetch dreams from the database and join with user data
        const dreams = await Dream.aggregate([
            {
                $match: query // Apply the query based on the timeframe
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
            {
                $sort: {
                    dreamDate: -1
                }
            }
        ]);
        

        return NextResponse.json({ data: dreams });
    } catch (error) {
        console.error('Error fetching dream data: ', error);
        return NextResponse.json({ error: error.message });
    }
}



