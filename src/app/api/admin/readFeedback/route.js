import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Feedback from '../../../../../models/feedback';

export async function POST(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Parse the request body to get feedbackID
        const { feedbackID } = await req.json();

        // Update the feedback entry to set hasBeenRead to true
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackID,
            { hasBeenRead: true },
            { new: true }
        );

        // Check if the feedback was found and updated
        if (!updatedFeedback) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feedback marked as read', data: updatedFeedback });
    } catch (error) {
        console.error('Error updating feedback: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
