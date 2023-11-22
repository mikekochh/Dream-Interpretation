import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function GET(request) {
    try {
        console.log("testig this is working");
        const pathname = request.nextUrl.pathname;
        const email = pathname.split('/').pop();
        console.log('email: ', email);
        await connectMongoDB();
        const activated = await User.findOne({ email }).select("activated");
        console.log('activated: ', activated);
        return NextResponse.json(activated);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}