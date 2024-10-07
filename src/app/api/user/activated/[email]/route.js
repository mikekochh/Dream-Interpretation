import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import User from "../../../../../../models/user";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found!' });
        }

        // Return the user data along with the activation status
        return NextResponse.json({
            user,
            isActivated: user.activated || false // Return the activated status as a boolean
        });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
