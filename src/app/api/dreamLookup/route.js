import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from "../../../../models/user";

import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function GET(request) {
    const dream = request.nextUrl.searchParams.get('dream');
    const dreamCredits = request.nextUrl.searchParams.get('dreamCredits');
    const email = request.nextUrl.searchParams.get('email');
    const prompt = request.nextUrl.searchParams.get('prompt');
    const chatGPTPrompt = prompt + "\n\n" + dream;
    try {
        const dreamData = await interpretDream(chatGPTPrompt);
        const dreamCreditsData = await reduceDreamCredits(dreamCredits, email);
        return NextResponse.json(dreamData);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}

async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "o",
        messages: [{role: "user", content: dream}],
    })

    return chatCompletion.choices;
}

async function reduceDreamCredits(dreamCredits, email) {
    await connectMongoDB();
    const newCredits = await User.updateOne({ email }, { $set: { credits: dreamCredits - 1 } });
    return newCredits;
}