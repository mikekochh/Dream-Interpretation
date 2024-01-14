import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import Note from '../../../../../../models/notes';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();

        const dreamNotes = await Note.find({ dreamID: dreamID });

        return NextResponse.json({dreamNotes});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}

export async function POST(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const dreamID = pathname.split('/').pop();
        await connectMongoDB();

        const { note } = await request.json();

        const existingNote = await Note.findOne({ dreamID: dreamID });

        if (existingNote) {
            existingNote.note = note;
            existingNote.lastUpdated = new Date();
            await existingNote.save();
        }
        else {
            const newNote = await Note.create({ dreamID: dreamID, note: note, lastUpdated: new Date() });

        }

        return NextResponse.json({message: "Note added successfully!"}, { status: 200 });
        // const newNote = await Note.updateOne({ dreamID: dreamID }, { $set: { note: request.body.note, lastUpdated: request.body.lastUpdated }}, { new: true });
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}