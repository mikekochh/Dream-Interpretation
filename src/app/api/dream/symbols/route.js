import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import DreamSymbols from '../../../../../models/dreamSymbols';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Find oracles where the "active" field is true
        const dreamSymbols = await DreamSymbols.find();
        
        return NextResponse.json(dreamSymbols);
    } catch (error) {
        console.log('error getting dream symbols: ', error);
        return NextResponse.error(error);
    }
}
