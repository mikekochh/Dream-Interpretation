import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function POST(req) {
    try {
        // create user
        const { oracleID, userID } = await req.json();

        await connectMongoDB();

        const newUser = await User.findOneAndUpdate({ _id: userID }, { $set: { metaAnalysisOracleID: oracleID } }, { new: true });

        if (!newUser) {
            throw new Error("Problem with updating user!");
        }

        return NextResponse.json({message: "User meta analysis oracle updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User meta analysis oracle update failed!"}, { status: 500 })
    }
}