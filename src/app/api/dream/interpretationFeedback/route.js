import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Interpretation from '../../../../../models/interpretation';

export async function POST(req) {
    try {
        // Extract dreamID and isPublic from the request parameters
        const { liked, interpretationID } = await req.json();

        // Connect to the MongoDB database
        await connectMongoDB();

        console.log("liked: ", liked);
        console.log("interpretationID: ", interpretationID);

        // Find the dream by its ID and update the isPublic field
        const updatedInterpretation = await Interpretation.findOneAndUpdate(
            { _id: interpretationID },
            { $set: { liked: liked } },
            { new: true }
        );
        
        console.log("updatedInterpretation: ", updatedInterpretation);

        // If the dream is not found, throw an error
        if (!updatedInterpretation) {
            throw new Error("Interpretation not found!");
        }

        // Return a success response
        return NextResponse.json({ message: "Interpretation feedback updated successfully!" }, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        // Return an error response if something goes wrong
        return NextResponse.json({ message: "Error updating interpretation feedback!" }, { status: 500 });
    }
}
