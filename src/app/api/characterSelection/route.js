import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        const { email, characterID } = await req.json();

        console.log('email: ', email);
        console.log('characterID: ', characterID);

        await connectMongoDB();
        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { characterID }}, { new: true });

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User character updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User character selection failed!"}, { status: 500 })
    }
}