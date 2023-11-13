import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Character from '../../../../models/characters';

export async function GET(req) {
    try {
        await connectMongoDB();
        const characters = await Character.find();
        return NextResponse.json(characters);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}