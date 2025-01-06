import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamArticle from '../../../../../../models/dreamArticle';

export async function POST(req) {
    try {
        const { articleTitle, articleURL, articlePicture, prompt, replyTweet, articleID } = await req.json();

        await connectMongoDB();

        // Validate that both fields are provided
        if (!articleTitle || !articleURL || !articlePicture || !prompt || !replyTweet || !articleID) {
            return NextResponse.json({ message: "Dream article stuff required!" }, { status: 400 });
        }

        // Create new dream symbol entry
        const newDreamArticle = await DreamArticle.create({ 
            articleTitle, 
            articleURL, 
            articlePicture, 
            prompt, 
            replyTweet,
            articleID
        });

        return NextResponse.json({ message: "Dream Article added successfully!", data: newDreamArticle });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ message: "Error adding Dream Article!" }, { status: 500 });
    }
}
