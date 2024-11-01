import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Feedback from '../../../../../models/feedback';

export async function GET(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Check if there is any feedback with hasBeenRead set to false
        const unreadFeedback = await Feedback.exists({ hasBeenRead: false });

        return NextResponse.json({ hasUnreadFeedback: !!unreadFeedback });
    } catch (error) {
        console.error('Error checking for unread feedback: ', error);
        return NextResponse.json({ error: error.message });
    }
}
