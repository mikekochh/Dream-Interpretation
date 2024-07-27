import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import MetaAnalysis from '../../../../../../models/metaAnalysis';
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        console.log("pathname: ", pathname);
        const userID = pathname.split('/').pop();
        console.log("userID for meta analysis: ", typeof userID);
        await connectMongoDB();

        const metaAnalysis = await MetaAnalysis.findOne({ userID: new mongoose.Types.ObjectId(userID) }).sort({ metaAnalysisDate: -1 });

        console.log("metaAnalysis: ", metaAnalysis);

        if (metaAnalysis) {
            return NextResponse.json({ metaAnalysis });
        }

        return NextResponse.json({ message: "Most recent dream meta analysis not found"}, { status: 404});
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
