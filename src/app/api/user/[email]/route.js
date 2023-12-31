import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const email = pathname.split('/').pop();
        console.log('are we getting here email: ', email);
        console.log('|' + email + '|');
        await connectMongoDB();
        const user = await User.findOne({ email });
        console.log('user: ', user);
        if (!user) {
            return NextResponse.error(new Error('User not found!'));
        }
        return NextResponse.json(user);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}