import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import SoundStreak from '../../../../../models/soundStreaks';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        const url = new URL(req.url);
        const userID = url.searchParams.get('userID');
        
        if (!userID) {
            return NextResponse.json({ error: 'userID is required' }, { status: 400 });
        }
        
        const userSoundStreak = await SoundStreak.find({ userID: new mongoose.Types.ObjectId(userID) });
        
        if (!userSoundStreak) {
            return NextResponse.json({ error: 'User sound streak not found' }, { status: 404 });
        }
        
        return NextResponse.json({ soundStreak: userSoundStreak });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
