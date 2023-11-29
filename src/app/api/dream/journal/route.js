import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from "../../../../../models/dream";


export async function POST(req) {
    try {
        // create user
        const { dream, userID } = await req.json();

        console.log("Dream: ", dream);
        console.log("userID: ", userID);
        const dreamDate = new Date();
        console.log("Date: ", dreamDate);

        await connectMongoDB();

        const newDream = await Dream.create({ 
            dream, 
            userID, 
            interpretationID: 0, 
            dreamDate
        });

        console.log("newDream: ", newDream);

        return NextResponse.json(newDream);

        // return NextResponse.json(
        //     { status: 200 },
        //     { newDream }
        // );
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}