import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Oracle from '../../../../../models/oracles';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
    try {
        // create user
        const { question, dream, interpretation, oracleID } = await req.json();

        const oracle = await Oracle.findOne({ oracleID });

        const entirePrompt = oracle.questionPrompt + "\n```\nDream: " + dream + "\n```\n" + interpretation + "\n```\nQuestion: " + question;

        await connectMongoDB();

        const answer = await askQuestion(entirePrompt); 

        const answerText = answer[0].message.content;

        return NextResponse.json({answerText}, { status: 200});
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}

async function askQuestion(prompt) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
    })
    // logger.info('chatCompletion: ', chatCompletion);

    return chatCompletion.choices;
}