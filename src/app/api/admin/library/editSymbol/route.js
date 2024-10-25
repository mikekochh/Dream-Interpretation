import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamSymbol from '../../../../../../models/dreamSymbols';

export async function POST(req) {
    try {
        const { symbolID, meaning } = await req.json();

        await connectMongoDB();

        if (symbolID) {
            const updatedDreamSymbol = await DreamSymbol.updateOne(
                { _id: symbolID }, 
                { $set: { meaning: meaning } }
            );

            if (!updatedDreamSymbol) {
                return NextResponse.json({message: "Dream Symbol update failed!"}, { status: 500 });
            }

            return NextResponse.json(updatedDreamSymbol);
        } 
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Dream Symbol update failed!"}, { status: 500 })
    }
}