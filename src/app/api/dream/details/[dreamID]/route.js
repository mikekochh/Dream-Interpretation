import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';
import Interpretation from '../../../../../../models/interpretation';

export async function GET(request) {
    try {
        console.log("We getting here?");
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();
        console.log("dreamID: ", dreamID);

        const dreamDetails = await Interpretation.find({ dreamID: dreamID });
        console.log("dreamDetails: ", dreamDetails);

        return NextResponse.json({dreamDetails});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}