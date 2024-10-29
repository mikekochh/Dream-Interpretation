import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Dream from '../../../../../../models/dream';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();

        const dream = await Dream.findById(dreamID);

        console.log('dream: ', dream);

        return NextResponse.json({data: dream.isPublic});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}