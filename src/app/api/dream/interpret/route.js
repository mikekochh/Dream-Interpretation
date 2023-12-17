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
        const { dreamID, dream , oracleID, user, short } = await req.json();

        console.log("oracleID: ", oracleID);

        const oracle = await Oracle.findOne({ oracleID });
        const prompt = oracle.prompt;

        console.log("short: ", short);

        const interpretationDate = new Date();

        const shorternText = short ? "\n\n" + "The interpretation should only be 5 sentences long. " : "";

        const chatGPTPrompt = prompt + "\n\n" + dream + shorternText;

        try {
            console.log("Waiting to interpret dream...");
            const dreamData = await interpretDream(chatGPTPrompt);
            const interpretation = dreamData[0].message.content;
            if (!user.subscribed) {
                const dreamCreditsData = await reduceDreamCredits(user._id);
            }
            const newInterpretation = await Interpretation.create({
                dreamID,
                oracleID,
                interpretation,
                interpretationDate
            });
            return NextResponse.json(dreamData);
        } catch (error) {
            console.log('error: ', error);
            return NextResponse.error(error);
        }
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}

async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{role: "user", content: dream}],
    })

    return chatCompletion.choices;
}

async function reduceDreamCredits(_id) {
    await connectMongoDB();
    const newCredits = await User.updateOne({ _id }, { $inc: { credits: -1 } });
    return newCredits;
}