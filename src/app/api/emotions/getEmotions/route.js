import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Emotion from '../../../../../models/emotions';

export async function GET(req) {
    try {
        await connectMongoDB();
        const emotions = await Emotion.find();
        return NextResponse.json(emotions);
    } catch (error) {
        console.log('error retrieving emotions: ', error);
        return NextResponse.error(error);
    }
}