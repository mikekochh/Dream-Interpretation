import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import View from '../../../../../models/views';

export async function DELETE(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Delete all views from the database
        const result = await View.deleteMany({});

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'No views found to delete' }, { status: 404 });
        }

        return NextResponse.json({ message: 'All views deleted successfully' });
    } catch (error) {
        console.error('Error deleting views: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
