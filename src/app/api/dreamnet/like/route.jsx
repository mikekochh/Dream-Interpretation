import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';
import Like from '../../../../../models/likes';

export async function POST(req) {
    try {
        const { dreamID, giverID, receiverID } = await req.json();

        await connectMongoDB();

        const dream = await Dream.findByIdAndUpdate({ _id: dreamID }, { $inc: { likes: 1 } });

        if (!dream) {
            return NextResponse.json({message: "User dream not found!"}, { status: 404 })
        }

        const like = await Like.create({ giverID, dreamID, receiverID });

        if (!like) {
            return NextResponse.json({message: "Failed to save like!"}, { status: 404 })
        }

        return NextResponse.json({message: "User dream successfully liked!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User dream deletion failed!"}, { status: 500 })
    }
}