import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamStreak from '../../../../../../models/dreamStreaks';
import mongoose from 'mongoose';

export async function POST(req) {
    try {
        await connectMongoDB();

        const { userID } = await req.json();
        
        if (!userID) {
            return NextResponse.json({ error: 'userID is required' }, { status: 400 });
        }

        let dreamStreak = await DreamStreak.findOne({ userID: new mongoose.Types.ObjectId(userID) });
        console.log("dreamStreak from newStreak: ", dreamStreak);
            
        if (!dreamStreak) {
            dreamStreak = new DreamStreak({
                userID,
                streakLength: 1,
                dreamedToday: true
            });
        } else {
            if (!dreamStreak.dreamedToday) {
                dreamStreak.streakLength += 1;
                dreamStreak.dreamedToday = true;
            }
        }
        
        await dreamStreak.save();
        
        return NextResponse.json({ dreamStreak });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ error: 'Error creating Dream Streak' }, { status: 500 });
    }
}
