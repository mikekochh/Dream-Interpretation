import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Gender from '../../../../models/genders';

export async function GET(req) {
    try {
        await connectMongoDB();
        const genders = await Gender.find();
        return NextResponse.json(genders);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}