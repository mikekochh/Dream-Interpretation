import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';


export async function POST(req) {
    try {
        const { dreamID, starredStatus } = await req.json();
        console.log('dreamID: ', dreamID);
        console.log('starredStatus: ', starredStatus);

        await connectMongoDB();

        const updatedDream = await Dream.findOneAndUpdate(
            { _id: dreamID },
            {
                $set: { starred: !starredStatus },
            },
            { new: true }
        );

        console.log('updatedDream: ', updatedDream);
        

        if (!updatedDream) {
            throw new Error("Dream not updated!");
        }

        return NextResponse.json({message: "Dream star status updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Dream star status update failed!"}, { status: 500 })
    }
}