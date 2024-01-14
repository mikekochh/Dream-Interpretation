import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Blog from '../../../../../models/blogs';

export async function POST(req) {
    try {
        // create user
        const { blogID } = await req.json();

        await connectMongoDB();

        const likeBlog = await Blog.findOneAndUpdate({ blogID: blogID }, { $inc: { likes: 1 } });

        if (!likeBlog) {
            throw new Error("Blog not found!");
        }

        return NextResponse.json({status: 200});
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Failed to like blog!"}, { status: 500 })
    }
}