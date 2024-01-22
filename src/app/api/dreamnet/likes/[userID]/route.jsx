import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Like from '../../../../../../models/likes';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const userID = pathname.split('/').pop();
        await connectMongoDB();

        const likes = await Like.find({ giverID: userID });

        return NextResponse.json({likes});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}