import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamSymbol from '../../../../../../models/dreamSymbols';

export async function POST(req) {
    try {
        const { symbol, meaning } = await req.json();

        await connectMongoDB();

        // Validate that both fields are provided
        if (!symbol || !meaning) {
            return NextResponse.json({ message: "Dream symbol and meaning required!" }, { status: 400 });
        }

        // Create new dream symbol entry
        const newDreamSymbol = await DreamSymbol.create({ symbol, meaning });

        return NextResponse.json({ message: "Dream Symbol added successfully!", data: newDreamSymbol });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ message: "Error adding Dream Symbol!" }, { status: 500 });
    }
}
