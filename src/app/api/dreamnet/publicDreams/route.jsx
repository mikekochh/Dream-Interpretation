import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function GET(request) {
    try {
        await connectMongoDB();

        const dreams = await Dream.find({publicDream: true});

        const dreamsSorted = dreams.sort((a, b) => {
            return b.dreamDate - a.dreamDate;
        });

        return NextResponse.json({dreamsSorted});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}