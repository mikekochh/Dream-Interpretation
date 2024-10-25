import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamSymbol from '../../../../../../models/dreamSymbols';

export async function DELETE(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Extract the dreamID from the request body
        const { symbolID } = await req.json(); // Assuming the dreamID is sent in the request body

        if (!symbolID) {
            return NextResponse.json({ error: 'Symbol ID is required' }, { status: 400 });
        }

        // Delete the dream from the database
        const result = await DreamSymbol.findByIdAndDelete(symbolID);

        if (!result) {
            return NextResponse.json({ error: 'Symbol not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Dream symbol deleted successfully' });
    } catch (error) {
        console.error('Error deleting dream symbol: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
