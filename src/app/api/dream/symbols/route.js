import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import DreamSymbols from '../../../../../models/dreamSymbols';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Fetch dream symbols and sort by symbol name in ascending alphabetical order
        const dreamSymbols = await DreamSymbols.find().sort({ symbol: 1 });
        
        return NextResponse.json(dreamSymbols);
    } catch (error) {
        console.log('error getting dream symbols: ', error);
        return NextResponse.error(error);
    }
}
