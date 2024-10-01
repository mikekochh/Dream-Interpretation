import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import SoundStreak from '../../../../../../models/soundStreaks';
import mongoose from 'mongoose';

export async function POST(req) {
    try {
        await connectMongoDB();

        const { userID } = await req.json();
        
        if (!userID) {
            return NextResponse.json({ error: 'userID is required' }, { status: 400 });
        }

        let soundStreak = await SoundStreak.findOne({ userID: new mongoose.Types.ObjectId(userID) });
            
        if (!soundStreak) {
            soundStreak = new SoundStreak({
                userID,
                streakLength: 1,
                soundToday: true
            });
        } else {
            if (!soundStreak.soundToday) {
                soundStreak.streakLength += 1;
                soundStreak.soundToday = true;
            }
        }
        
        await soundStreak.save();
        
        return NextResponse.json({ soundStreak });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ error: 'Error creating Dream Streak' }, { status: 500 });
    }
}
