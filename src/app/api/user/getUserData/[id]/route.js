import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const id = pathname.split('/').pop();
        console.log("the id: ", id);
        await connectMongoDB();
        const user = await User.findById(id);
        console.log("the user found: ", user);
        if (!user) {
            return NextResponse.error(new Error('User not found!'));
        }
        return NextResponse.json(user);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}