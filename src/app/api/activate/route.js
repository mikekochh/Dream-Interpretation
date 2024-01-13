import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { verificationTokenID } = await req.json();

        await connectMongoDB();

        const activatedUser = await User.findOneAndUpdate(
            { verificationTokenID },
            {
                $set: { activated: true }
            },
            { new: true }
        );
        

        if (!activatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User activated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}