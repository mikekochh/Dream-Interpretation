import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function POST(req) {
    try {
        // Extract dreamID and isPublic from the request parameters
        const { dreamID, isPublic } = await req.json();

        // Connect to the MongoDB database
        await connectMongoDB();

        console.log("dreamID: ", dreamID);
        console.log("isPublic: ", isPublic);

        // Find the dream by its ID and update the isPublic field
        const updatedDream = await Dream.findOneAndUpdate(
            { _id: dreamID },
            { $set: { isPublic: isPublic } },
            { new: true }
        );
        
        console.log("updatedDream: ", updatedDream);

        // If the dream is not found, throw an error
        if (!updatedDream) {
            throw new Error("Dream not found!");
        }

        // Return a success response
        return NextResponse.json({ message: "Dream visibility updated successfully!" }, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        // Return an error response if something goes wrong
        return NextResponse.json({ message: "Error updating dream visibility!" }, { status: 500 });
    }
}
