import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userID } = await req.json();

        // Find the user by ID and update the sendReminder field to true
        const updatedUser = await User.findByIdAndUpdate(
            userID, 
            { sendReminder: true }, // Set sendReminder to true
            { new: true } // Return the updated user after the change
        );

        console.log("updatedUser: ", updatedUser);

        if (!updatedUser) {
            return NextResponse.json({ success: false }, { status: 404 });
        }

        return NextResponse.json({ success: true });
        
    } catch (error) {
        console.log("There was an error setting sendDreamReminder: ", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
