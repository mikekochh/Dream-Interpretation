import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';
import User from '../../../../../models/user';
import DreamEmotion from '../../../../../models/journaledEmotions';
import DreamStreak from '../../../../../models/dreamStreaks';

export async function POST(req) {
    try {
        const { dream, userID, interpretDream, emotions } = await req.json();
        const dreamDate = new Date();

        await connectMongoDB();

        let newDream;

        if (userID) {
            newDream = await Dream.create({
                dream,
                userID,
                interpretationID: 0,
                dreamDate,
                interpretation: interpretDream
            });

            if (!newDream) {
                return NextResponse.json({ message: "Dream creation failed!" }, { status: 500 });
            }

            const user = await User.findByIdAndUpdate(userID, { $inc: { dreamCount: 1 } });

            if (!user) {
                return NextResponse.json({ message: "User not found!" }, { status: 500 });
            }
            
            let dreamStreak = await DreamStreak.findOne({ userID: user._id });
            
            if (!dreamStreak) {
                dreamStreak = new DreamStreak({
                    userID: user._id.toString(),
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
        } else {
            newDream = await Dream.create({
                dream,
                interpretationID: 0,
                dreamDate,
                interpretation: interpretDream
            });

            if (!newDream) {
                return NextResponse.json({ message: "Dream creation failed!" }, { status: 500 });
            }
        }

        // Add DreamEmotion entries
        if (emotions && emotions.length > 0) {
            const dreamEmotions = emotions.map(emotionID => ({
                emotionID,
                dreamID: newDream._id
            }));
            await DreamEmotion.insertMany(dreamEmotions);
        }

        return NextResponse.json(newDream);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ message: "Dream creation failed!" }, { status: 500 });
    }
}
