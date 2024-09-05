import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Dream from "../../../../../models/dream";
import Interpretation from "../../../../../models/interpretation";

export async function GET(req) {
    try {
        const pathname = req.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();
        const dream = await Dream.findById(dreamID);
        if (!dream) {
            return NextResponse.error(new Error('Dream not found!'));
        }

        const interpretations = await Interpretation.find({ dreamID });
        return NextResponse.json({ dream, interpretations });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}