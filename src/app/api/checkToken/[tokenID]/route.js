import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function GET(request) {
    try {
        console.log("testing this this this is working");
        const pathname = request.nextUrl.pathname;
        const verificationTokenID = pathname.split('/').pop();
        console.log('verificationTokenID: ', verificationTokenID);
        await connectMongoDB();
        const activated = await User.findOne({ verificationTokenID }).select("activated");
        console.log('activated: ', activated);

        if (!activated) {
            throw new Error('Invalid verification token');
        }

        return NextResponse.json(activated);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}