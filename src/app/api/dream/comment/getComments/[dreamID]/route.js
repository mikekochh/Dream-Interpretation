import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../../lib/mongodb';
import DreamComment from '../../../../../../../models/dreamComment';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Get dreamID from query parameters
        const pathname = req.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();

        console.log("dreamID: ", dreamID);
        
        if (!dreamID) {
            return NextResponse.json({ message: 'dreamID is required' }, { status: 400 });
        }
        
        // Fetch and sort dream comments by commentDate in descending order
        const dreamComments = await DreamComment.find({ dreamID }).sort({ commentDate: -1 });

        console.log("dreamComments: ", dreamComments);

        return NextResponse.json(dreamComments);
    } catch (error) {
        console.log('error retrieving dream symbols: ', error);
        return NextResponse.json({ message: 'Error retrieving dream symbols' }, { status: 500 });
    }
}
