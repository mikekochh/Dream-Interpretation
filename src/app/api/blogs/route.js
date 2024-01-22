import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Blog from '../../../../models/blogs';

export async function GET(request) {
    try {
        await connectMongoDB();

        const blogs = await Blog.find({active: true});

        const blogsSorted = blogs.sort((a, b) => {
            return b.blogID - a.blogID;
        });

        return NextResponse.json({blogsSorted});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}