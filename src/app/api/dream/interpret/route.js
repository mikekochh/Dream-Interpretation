import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Interpretation from "../../../../../models/interpretation";
import Oracle from '../../../../../models/oracles';
import User from "../../../../../models/user";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req) {
    try {
        await connectMongoDB();
        // create user
        const { dreamID, interpretation , oracleID, user } = await req.json();

        const interpretationDate = new Date();

        try {
            if (!user.subscribed) {
                const dreamCreditsData = await reduceDreamCredits(user._id);
            }
            const newInterpretation = await Interpretation.create({
                dreamID,
                oracleID,
                interpretation,
                interpretationDate
            });

            if (!newInterpretation) {
                throw new Error('Interpretation creation failed!');
            }

            return NextResponse.json({message: "Interpretation saved successfully"}, { status: 200 });
        } catch (error) {
            console.log('error: ', error);
            return NextResponse.error(error);
        }
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}

async function reduceDreamCredits(_id) {
    await connectMongoDB();
    const newCredits = await User.updateOne({ _id }, { $inc: { credits: -1 } });
    return newCredits;
}