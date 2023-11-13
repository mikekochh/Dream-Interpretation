import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from "../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();
        const userCredits = await User.findOne({ email }).select("credits");
        return NextResponse.json(userCredits.credits);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}

export async function POST(req) {    
    try {
        const pathname = req.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { credits: 3 } }, { new: true });

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        const updatedUserWithCredits = await User.findOneAndUpdate({ email }, { $set: { redeemedCredits: true } }, { new: true });

        console.log('updatedUserWithCredits: ', updatedUserWithCredits);

        if (!updatedUserWithCredits) {
            throw new Error("User credits not received!");
        }

        return NextResponse.json({message: "User credits updated successfully!"}, { status: 200 });
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}