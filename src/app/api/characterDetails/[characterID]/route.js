import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Character from '../../../../../models/characters';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const characterID = pathname.split('/').pop();
        await connectMongoDB();

        const characterDetails = await Character.findOne({ characterID: characterID });

        return NextResponse.json({characterDetails});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}