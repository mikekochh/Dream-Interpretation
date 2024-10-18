

import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Page from '../../../../../models/pages';

export async function GET(req) {
    try {
        // Connect to the MongoDB database
        await connectMongoDB();

        // Fetch users from the database based on the query
        const pages = await Page.find({});

        return NextResponse.json({ data: pages });
    } catch (error) {
        console.error('Error fetching user data: ', error);
        return NextResponse.json({ error: error.message });
    }
}

