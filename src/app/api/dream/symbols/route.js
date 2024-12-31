import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Symbol from '../../../../../models/symbols';

export async function GET(req) {
    try {
        await connectMongoDB();
        const dreamSymbols = await Symbol.find().sort();

        return NextResponse.json(dreamSymbols);
    } catch (error) {
        console.log('Error getting dream symbols:', error);
        return NextResponse.error(error);
    }
}
