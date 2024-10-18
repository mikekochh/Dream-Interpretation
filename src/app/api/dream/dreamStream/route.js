import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function GET(request) {
    try {
        await connectMongoDB();

        // Fetch the latest 5 public dreams that have an imageURL, sorted by dreamDate (most recent first)
        const dreams = await Dream.find({ isPublic: true, imageURL: { $exists: true, $ne: '' } })
            .sort({ dreamDate: -1 }) // -1 for descending order (most recent first)
            .limit(5);

        console.log("dreams from dreamStream: ", dreams);

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
