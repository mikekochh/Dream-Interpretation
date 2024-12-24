import { NextResponse } from 'next/server';
import Symbol from '../../../../../../../models/symbols';
import { connectMongoDB } from '../../../../../../../lib/mongodb';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Extract the URL pathname from the request
        const url = new URL(req.url);
        const pathname = url.pathname;

        // Get the sanitizedSymbol from the end of the pathname
        const sanitizedSymbol = pathname.split('/').pop();

        console.log('sanitizedSymbol: ', sanitizedSymbol);

        // Search the database for the symbol with the matching sanitizedSymbol
        const dreamSymbol = await Symbol.findOne({ sanitizedSymbol });

        if (!dreamSymbol) {
            return NextResponse.json({ message: 'Symbol not found' }, { status: 404 });
        }

        return NextResponse.json(dreamSymbol);
    } catch (error) {
        console.log('error getting dream symbol: ', error);
        return NextResponse.error();
    }
}
