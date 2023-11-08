import User from "../../../../models/user";
import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';

export async function GET(req) {
    try {
        const { email } = await req.json();
        await connectMongoDB();
        const userData = await User.findOne({ email }).select("_id");
        const userCredits = await User.GET();
        console.log("userCredits: ", userCredits);
        return NextResponse.json(userData);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}