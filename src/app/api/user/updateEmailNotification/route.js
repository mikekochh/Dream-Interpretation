import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { emailNotification, userID } = await req.json();

        console.log("emailNotification: ", emailNotification);
        console.log("userID: ", userID);

        await connectMongoDB();

        const newUser = await User.findOneAndUpdate({ _id: userID }, { $set: { optOutEmailNotifications: emailNotification } }, { new: true });

        if (!newUser) {
            throw new Error("Problem with updating user email notification settings!");
        }

        return NextResponse.json({message: "User notification settings updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User notification settings update failed!"}, { status: 500 })
    }
}