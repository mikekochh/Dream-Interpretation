import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export async function POST(req) {
    try {
        // create user
        const { userID, subscribed } = await req.json();

        await connectMongoDB();

        const userSubscription = await User.findOneAndUpdate({ _id: userID }, { $set: { subscribed: !subscribed }}, { new: true });

        if (!userSubscription) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User subscription updated!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User subscription update failed!"}, { status: 500 })
    }
}