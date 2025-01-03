import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../../lib/mongodb";
import DreamArticle from "../../../../../../models/dreamArticle";

export async function GET(req) {
    try {
        await connectMongoDB();

        // Retrieve only the first three dream articles
        const dreamArticles = await DreamArticle.find().limit(3);

        console.log("dreamArticles: ", dreamArticles);

        return NextResponse.json(dreamArticles);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}
