import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb"
import User from "../../../../models/user";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { email } = await req.json();
        const credits = await User.findOne({ email }).select("credits");
        console.log("credits: ", credits);   
        return NextResponse.json({ credits });

    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "User registration failed!"}, { status: 500 })
    }
}