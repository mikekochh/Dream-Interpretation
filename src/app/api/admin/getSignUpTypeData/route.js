import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import SignUpType from '../../../../../models/signUpTypes';

export async function GET(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Fetch users from the database based on the query
        const signUpTypes = await SignUpType.find({});

        return NextResponse.json({ data: signUpTypes });
    } catch (error) {
        console.error('Error fetching sign up types: ', error);
        return NextResponse.json({ error: error.message });
    }
}

