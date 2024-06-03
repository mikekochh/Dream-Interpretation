import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import DreamEmotion from '../../../../../models/journaledEmotions';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Get dreamID from query parameters
        const { searchParams } = new URL(req.url);
        const dreamID = searchParams.get('dreamID');
        
        if (!dreamID) {
            return NextResponse.json({ message: 'dreamID is required' }, { status: 400 });
        }
        
        // Find all DreamEmotions with the given dreamID
        const dreamEmotions = await DreamEmotion.find({ dreamID });

        return NextResponse.json(dreamEmotions);
    } catch (error) {
        console.log('error retrieving dream emotions: ', error);
        return NextResponse.json({ message: 'Error retrieving dream emotions' }, { status: 500 });
    }
}
