import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function GET(request) {
    try {
        await connectMongoDB();

        // Fetch the latest 5 public dreams, sorted by dreamDate (most recent first)
        const dreams = await Dream.find({ isPublic: true })
            .readPreference('primary')
            .sort({ dreamDate: -1 })
            .limit(5);

        console.log("latest public dreams: ", dreams);

        if (dreams) {
            return NextResponse.json({ dreams });
        } else {
            return NextResponse.json({ error: 'Public dreams not found' }, { status: 404 });
        }
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
