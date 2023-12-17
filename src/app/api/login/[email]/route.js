import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const email = pathname.split('/').pop();
        await connectMongoDB();
        const activated = await User.findOne({ email }).select("activated");
        return NextResponse.json(activated);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}