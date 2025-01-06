import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamArticle from '../../../../../../models/dreamArticle';

export async function POST(req) {
    try {
        const { articleTitle, articleURL, articlePicture, prompt, replyTweet, articleID } = await req.json();

        await connectMongoDB();

        if (articleID) {
            const updatedDreamArticle = await DreamArticle.updateOne(
                { articleID: articleID }, 
                { $set: { 
                    articleTitle: articleTitle,
                    articleURL: articleURL,
                    articlePicture: articlePicture,
                    prompt: prompt,
                    replyTweet: replyTweet 
                } }
            );

            if (!updatedDreamArticle) {
                return NextResponse.json({message: "Dream Article update failed!"}, { status: 500 });
            }

            return NextResponse.json(updatedDreamArticle);
        } 
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Dream Article update failed!"}, { status: 500 })
    }
}