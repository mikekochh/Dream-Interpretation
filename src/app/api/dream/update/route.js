import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from "../../../../../models/dream";


export async function POST(req) {
    try {
        const { newDream, dreamID } = await req.json();

        await connectMongoDB();

        if (dreamID) {
            const updatedDream = await Dream.updateOne(
                { _id: dreamID }, 
                { $set: { dream: newDream } }
            );

            if (!updatedDream) {
                return NextResponse.json({message: "Dream update failed!"}, { status: 500 });
            }

            return NextResponse.json(newDream);
        } 
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Dream update failed!"}, { status: 500 })
    }
}