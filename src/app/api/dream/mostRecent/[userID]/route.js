import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Dream from '../../../../../../models/dream';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const userID = pathname.split('/').pop();
        await connectMongoDB();

        // Find the most recent dream for the given user ID
        const dream = await Dream.findOne({ userID }).sort({ dreamDate: -1 });

        if (dream) {
            return NextResponse.json({ dream });
        }

        return NextResponse.json({ message: "Most recent dream not found"}, { status: 404});
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
