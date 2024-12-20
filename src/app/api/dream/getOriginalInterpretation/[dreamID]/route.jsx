import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import Interpretation from "../../../../../../models/interpretation";

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();

        const originalInterpretation = await Interpretation.find({ dreamID: dreamID });

        return NextResponse.json(originalInterpretation);
    }
    catch (error) {
        console.log('error fetching original interpretation: ', error);
        return NextResponse.error(error);
    }
}