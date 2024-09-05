import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import DreamSymbol from '../../../../../models/dreamSymbols';
import UserDreamSymbol from '../../../../../models/userDreamSymbols';

export async function GET(req) {
    try {
        await connectMongoDB();
        
        // Get dreamID from query parameters
        const { searchParams } = new URL(req.url);
        const dreamID = searchParams.get('dreamID');
        
        if (!dreamID) {
            return NextResponse.json({ message: 'dreamID is required' }, { status: 400 });
        }
        
        // Find all UserDreamSymbols with the given dreamID and populate the symbolID with the related DreamSymbol data
        const userDreamSymbols = await UserDreamSymbol.find({ dreamID }).populate('symbolID');

        return NextResponse.json(userDreamSymbols);
    } catch (error) {
        console.log('error retrieving dream symbols: ', error);
        return NextResponse.json({ message: 'Error retrieving dream symbols' }, { status: 500 });
    }
}
