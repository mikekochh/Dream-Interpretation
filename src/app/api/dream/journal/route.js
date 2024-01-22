import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from "../../../../../models/dream";


export async function POST(req) {
    try {
        // create user
        const { dream, userID, interpretDream, publicDream } = await req.json();
        const dreamDate = new Date();

        await connectMongoDB();

        const newDream = await Dream.create({ 
            dream, 
            userID, 
            interpretationID: 0, 
            dreamDate,
            interpretation: interpretDream,
            publicDream
        });

        return NextResponse.json(newDream);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}