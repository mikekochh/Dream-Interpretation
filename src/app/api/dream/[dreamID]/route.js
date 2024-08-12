import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Dream from "../../../../../models/dream";


export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();
        const dream = await Dream.findById(dreamID);
        console.log("dream: ", dream);
        if (!dream) {
            return NextResponse.error(new Error('Dream not found!'));
        }
        return NextResponse.json(dream);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}