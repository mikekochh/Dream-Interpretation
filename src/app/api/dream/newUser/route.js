import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function POST(req) {
    try {
        // create user
        const { userID, dreamID } = await req.json();

        await connectMongoDB();

        const updateDream = await Dream.findOneAndUpdate({ _id: dreamID }, { $set: { userID: userID }}, { new: true });
        
        if (!updateDream) {
            throw new Error("Dream not found!");
        }

        return NextResponse.json({message: "Local dream added to user account!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Local dream was not added to user account!"}, { status: 200 })
    }
}