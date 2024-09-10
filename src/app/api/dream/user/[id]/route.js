import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const id = pathname.split('/').pop();
        await connectMongoDB();

        const userDreams = await Dream.find({ userID: id });

        return NextResponse.json(userDreams);
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}