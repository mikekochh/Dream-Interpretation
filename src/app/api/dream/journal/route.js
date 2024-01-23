import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from "../../../../../models/dream";
import User from '../../../../../models/user';


export async function POST(req) {
    try {
        // create user
        const { dream, userID, interpretDream } = await req.json();
        const dreamDate = new Date();

        await connectMongoDB();

        const newDream = await Dream.create({ 
            dream, 
            userID, 
            interpretationID: 0, 
            dreamDate,
            interpretation: interpretDream
        });

        if (!newDream) {
            return NextResponse.json({message: "Dream creation failed!"}, { status: 500 })
        }

        const user = await User.findByIdAndUpdate(userID, { $inc: { dreamCount: 1 } })

        if (!user) {
            return NextResponse.json({message: "User not found!"}, { status: 500 })
        }

        return NextResponse.json(newDream);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}