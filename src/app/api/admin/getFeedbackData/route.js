import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Feedback from '../../../../../models/feedback';

export async function GET(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Fetch feedback and sort by feedbackDate in descending order
        const feedback = await Feedback.find({}).sort({ feedbackDate: -1 });

        return NextResponse.json({ data: feedback });
    } catch (error) {
        console.error('Error fetching feedback data: ', error);
        return NextResponse.json({ error: error.message });
    }
}
