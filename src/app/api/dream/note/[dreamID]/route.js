import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Note from '../../../../../../models/notes';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();
        console.log("dreamID: ", dreamID);

        const dreamNotes = await Note.find({ dreamID: dreamID });
        console.log("dreamNotes: ", dreamNotes);

        return NextResponse.json({dreamNotes});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}

export async function POST(request) {
    try {
        console.log("We getting here?");
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();
        console.log("dreamID: ", dreamID);

        const { note } = await request.json();
        console.log("note: ", note);

        const newNote = await Note.create({ dreamID: dreamID, note: note, lastUpdated: new Date() });

        return NextResponse.json({message: "Note added successfully!"}, { status: 200 });
        // const newNote = await Note.updateOne({ dreamID: dreamID }, { $set: { note: request.body.note, lastUpdated: request.body.lastUpdated }}, { new: true });
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}