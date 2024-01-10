import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import Blog from '../../../../models/blogs';

export async function GET(request) {
    try {
        await connectMongoDB();

        const blogs = await Blog.find({});

        console.log("blogs: ", blogs);  

        return NextResponse.json({blogs});
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }

}