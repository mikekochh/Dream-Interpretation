import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { userID, signUpTypeID } = await req.json();

        await connectMongoDB();

        const newUser = await User.findOneAndUpdate({ _id: userID }, { $set: { signUpTypeID } }, { new: true });

        if (!newUser) {
            throw new Error("Problem with updating user sig up type!");
        }

        return NextResponse.json({message: "User successfully updated their sign up type!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User sign up type update failed!"}, { status: 500 })
    }
}