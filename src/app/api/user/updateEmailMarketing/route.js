import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { emailMarketing, userID } = await req.json();

        console.log("emailMarketing: ", emailMarketing);
        console.log("userID: ", userID);

        await connectMongoDB();

        const newUser = await User.findOneAndUpdate({ _id: userID }, { $set: { optOutEmailMarketing: emailMarketing } }, { new: true });

        console.log("newUser: ", newUser);

        if (!newUser) {
            throw new Error("Problem with updating user email marketing settings!");
        }

        return NextResponse.json({message: "User marketing settings updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User marketing settings update failed!"}, { status: 500 })
    }
}