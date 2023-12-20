import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Feedback from '../../../../models/feedback';

export async function POST(req) {
    try {
        // create user
        const { feedback, userEmail } = await req.json();

        await connectMongoDB();

        const newFeedback = await Feedback.create({ feedback, userEmail, feedbackDate: new Date() });

        if (!newFeedback) {
            throw new Error("Feedback not created!");
        }

        return NextResponse.json({message: "User feedback recorded successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User feedback failed!"}, { status: 500 })
    }
}