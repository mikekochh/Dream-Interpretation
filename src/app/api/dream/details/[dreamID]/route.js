import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';
import Interpretation from '../../../../../../models/interpretation';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();

        const dreamDetails = await Interpretation.find({ dreamID: dreamID });

        return NextResponse.json({dreamDetails});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}