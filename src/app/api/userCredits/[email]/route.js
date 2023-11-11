import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from "../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        // Extract the email from the end of the pathname
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

    const { email, dreamCredits } = await req.json();

    try {
        User.updateOne({ email }, { $set: { credits:  dreamCredits - 1} });
        return NextResponse.json({message: "User credits updated successfully!"}, { status: 200 })
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}