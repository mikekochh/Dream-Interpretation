import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Dream from '../../../../../../models/dream';
import MetaAnalysis from '../../../../../../models/metaAnalysis';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const userID = pathname.split('/').pop();
        await connectMongoDB();

        const metaAnalysis = await MetaAnalysis.findOne({ userID }).sort({ metaAnalysisDate: -1 })

        if (metaAnalysis) {
            return NextResponse.json({ metaAnalysis });
        }

        return NextResponse.json({ message: "Most recent dream meta analysis not found"}, { status: 404});
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
