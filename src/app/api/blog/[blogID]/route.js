import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Blog from '../../../../../models/blogs';

export async function GET(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const blogID = pathname.split('/').pop();
        await connectMongoDB();

        console.log('blogID:', blogID);

        const blogDetails = await Blog.findOne({ blogID: blogID });

        console.log('blogDetails:', blogDetails);

        if (!blogDetails) {
            throw new Error("Blog not found!");
        }

        return NextResponse.json({blogDetails});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}