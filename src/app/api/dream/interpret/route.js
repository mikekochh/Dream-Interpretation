import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Interpretation from "../../../../../models/interpretation";
import Character from '../../../../../models/characters';
import User from "../../../../../models/user";
import { Inter } from 'next/font/google';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(req) {
    try {
        await connectMongoDB();
        // create user
        const { dreamID, dream , characterID, user } = await req.json();

        console.log("dreamID: ", dreamID);
        console.log("dream: ", dream);
        console.log("characterID: ", characterID);
        console.log("user: ", user);

        const character = await Character.findOne({ characterID });
        const prompt = character.prompt;

        const interpretationDate = new Date();

        const chatGPTPrompt = prompt + "\n\n" + dream;
        try {
            console.log("Waiting to interpret dream...");
            const dreamData = await interpretDream(chatGPTPrompt);
            const interpretation = dreamData[0].message.content;
            const dreamCreditsData = await reduceDreamCredits(user.credits, user._id);
            const newInterpretation = await Interpretation.create({
                dreamID,
                characterID,
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

async function reduceDreamCredits(dreamCredits, _id) {
    await connectMongoDB();
    const newCredits = await User.updateOne({ _id }, { $set: { credits: dreamCredits - 1 } });
    return newCredits;
}