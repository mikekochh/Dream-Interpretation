import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();
        const user = await User.findOne({ email });
        return NextResponse.json(user);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}