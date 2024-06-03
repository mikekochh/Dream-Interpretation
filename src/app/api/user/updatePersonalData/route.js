import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { genderID, culturalBackground, spiritualPractices, userID, age } = await req.json();

        await connectMongoDB();

        const updateFields = {};
        if (genderID) updateFields.genderID = genderID;
        if (culturalBackground) updateFields.culturalBackground = culturalBackground;
        if (spiritualPractices) updateFields.spiritualPractices = spiritualPractices;
        if (age) updateFields.age = age;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userID },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        if (!updatedUser) {
            throw new Error("Problem with updating user!");
        }

        return NextResponse.json({message: "User information updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User information update failed!"}, { status: 500 })
    }
}