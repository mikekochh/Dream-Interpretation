import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';

export async function DELETE(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Extract the dreamID from the request body
        const { dreamID } = await req.json(); // Assuming the dreamID is sent in the request body

        if (!dreamID) {
            return NextResponse.json({ error: 'Dream ID is required' }, { status: 400 });
        }

        // Delete the dream from the database
        const result = await Dream.findByIdAndDelete(dreamID);

        if (!result) {
            return NextResponse.json({ error: 'Dream not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Dream deleted successfully' });
    } catch (error) {
        console.error('Error deleting dream: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
