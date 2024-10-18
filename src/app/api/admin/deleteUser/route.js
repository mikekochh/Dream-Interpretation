import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';

export async function DELETE(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Extract the dreamID from the request body
        const { userID, is_admin, is_subscriber } = await req.json(); // Assuming the dreamID is sent in the request body

        if (!userID) {
            return NextResponse.json({ error: 'Dream ID is required' }, { status: 400 });
        }

        if (is_admin) {
            return NextResponse.json({ error: "You cannot delete an admin!!"}, { status: 400 });
        }

        if (is_subscriber) {
            return NextResponse.json({ error: "You cannot delete an active subsriber!!"}, { status: 400 });
        }

        // Delete the dream from the database
        const result = await User.findByIdAndDelete(userID);

        if (!result) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting dream: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
