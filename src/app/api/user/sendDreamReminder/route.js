import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userID, signUpTypeID } = await req.json();

        let updatedUser;

        if (signUpTypeID) {
            // Find the user by ID and update the sendReminder field to true
            updatedUser = await User.findByIdAndUpdate(
                userID, 
                { sendReminder: true }, // Set sendReminder to true
                { signUpTypeID },
                { new: true } // Return the updated user after the change
            );
        } else {
            // Find the user by ID and update the sendReminder field to true
            updatedUser = await User.findByIdAndUpdate(
                userID, 
                { sendReminder: true }, // Set sendReminder to true
                { new: true } // Return the updated user after the change
            );
        }

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
