import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { genderID, culturalBackground, spiritualPractices, userID, birthdate, name } = await req.json();

        console.log("genderID: ", genderID);
        console.log("culturalBackground: ", culturalBackground);
        console.log("spiritualPractices: ", spiritualPractices);
        console.log("userID: ", userID);
        console.log("birthdate: ", birthdate);
        console.log("name: ", name);

        await connectMongoDB();

        const updateFields = {};
        if (genderID) updateFields.genderID = genderID;
        if (culturalBackground) updateFields.culturalBackground = culturalBackground;
        if (spiritualPractices) updateFields.spiritualPractices = spiritualPractices;
        if (birthdate) updateFields.birthdate = birthdate;
        if (name) updateFields.name = name;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userID },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        console.log("updatedUser: ", updatedUser);

        if (!updatedUser) {
            throw new Error("Problem with updating user!");
        }

        return NextResponse.json({message: "User information updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User information update failed!"}, { status: 500 })
    }
}