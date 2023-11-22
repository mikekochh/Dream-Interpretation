import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        // create user
        const { verificationTokenID, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectMongoDB();

        const updatedUser = await User.findOneAndUpdate(
            { verificationTokenID }, 
            { $set: { password: hashedPassword, verificationTokenID: null }},
            { new: true });

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User activated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}