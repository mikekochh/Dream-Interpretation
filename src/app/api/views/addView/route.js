import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import View from '../../../../../models/views';

export async function POST(req) {
    try {
        await connectMongoDB(); // Connect to MongoDB
        const { userID, pageID } = await req.json();
        
        // Get the current date
        const viewDate = new Date();

        // Create a new view record
        const newView = new View({
            userID,
            pageID,
            view_date: viewDate
        });

        // Save the view record
        await newView.save();

        console.log("View recorded: ", newView);

        return NextResponse.json({ success: true, view: newView });
        
    } catch (error) {
        console.error("There was an error recording the view: ", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
