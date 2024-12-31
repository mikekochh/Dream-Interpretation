import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import DreamArticle from "../../../../../models/dreamArticle";

export async function GET(req) {
    try {
        await connectMongoDB();

        const dreamArticles = await DreamArticle.find();

        console.log("dreamArticles: ", dreamArticles);

        return NextResponse.json(dreamArticles);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}