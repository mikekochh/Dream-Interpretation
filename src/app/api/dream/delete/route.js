import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Interpretation from '../../../../../models/interpretation';
import Dream from '../../../../../models/dream';

export async function POST(req) {
    try {
        const { dreamID } = await req.json();

        await connectMongoDB();
        await Interpretation.deleteMany({ dreamID: dreamID });
        await Dream.findByIdAndDelete({ _id: dreamID });

        return NextResponse.json({message: "User dream deletion successful!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User dream deletion failed!"}, { status: 500 })
    }
}