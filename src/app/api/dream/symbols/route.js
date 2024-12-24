import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Symbol from '../../../../../models/symbols';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Fetch dream symbols and sort by symbolsCount in descending order
        const dreamSymbols = await Symbol.find().sort();
        
        return NextResponse.json(dreamSymbols);
    } catch (error) {
        console.log('error getting dream symbols: ', error);
        return NextResponse.error(error);
    }
}
