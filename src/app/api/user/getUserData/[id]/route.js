import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";

export async function GET(req) {
    try {
        console.log("Getting user data...");
        const pathname = req.nextUrl.pathname;
        const id = pathname.split('/').pop();
        console.log("Here is the id: ", id);
        await connectMongoDB();
        const user = await User.findById(id);
        console.log("Here is the user: ", user);
        if (!user) {
            return NextResponse.error(new Error('User not found!'));
        }
        return NextResponse.json(user);
    } catch (error) {
        console.log('error: ', error);
        console.log("There was an error getting user data: ", error.message);
        return NextResponse.error(error);
    }
}