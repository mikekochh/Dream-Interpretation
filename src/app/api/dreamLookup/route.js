const axios = require('axios');
import { NextResponse, NextRequest } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';

import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function GET(request) {
    const dream = request.nextUrl.searchParams.get('dream');
    const dreamCredits = request.nextUrl.searchParams.get('dreamCredits');
    const email = request.nextUrl.searchParams.get('email');
    const chatGPTPrompt = "What is the meaning of this dream? Interpret some of the symbols: \n\n" + dream;
    console.log('chatGPTPrompt: ', chatGPTPrompt);
    try {
        const dreamData = await interpretDream(dream);
        return NextResponse.json(dreamData);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}

async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: dream}],
    })

    return chatCompletion.choices;
}

async function reduceDreamCredits(dreamCredits) {

    await connectMongoDB();
    await User.updateOne({ email }, { $set: { credits: 10 } });

    return chatCompletion.choices;
}