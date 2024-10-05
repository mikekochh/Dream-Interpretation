import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { userID } = await req.json();

        await connectMongoDB();

        const newUser = await User.findOneAndUpdate({ _id: userID }, { $set: { usedFreeDream: true } }, { new: true });

        if (!newUser) {
            throw new Error("Problem with updating user free dream!");
        }

        return NextResponse.json({message: "User successfully used last free dream!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User last free dream update failed!"}, { status: 500 })
    }
}