import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import DreamStreak from '../../../../../models/dreamStreaks';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        const url = new URL(req.url);
        const userID = url.searchParams.get('userID');
        
        if (!userID) {
            return NextResponse.json({ error: 'userID is required' }, { status: 400 });
        }
        
        const userDreamStreak = await DreamStreak.find({ userID: new mongoose.Types.ObjectId(userID) });
        
        if (!userDreamStreak) {
            return NextResponse.json({ error: 'User dream streak not found' }, { status: 404 });
        }
        
        return NextResponse.json({ dreamStreak: userDreamStreak });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
