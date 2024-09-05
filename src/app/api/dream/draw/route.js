import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';
import axios from 'axios'; // Axios for HTTP requests

const isLocal = process.env.NODE_ENV === 'development';

// OpenAI API setup
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

export async function POST(req) {
    try {
        console.log("Are we getting here?");
        await connectMongoDB();
        // Get dream and dreamID from request
        const { dream, dreamID } = await req.json();

        const prompt = `A beautiful and dreamlike scene based on the following dream: ${dream}`;

        const imageResponse = await axios.post(
            OPENAI_API_URL,
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024",
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("imageResponse: ", imageResponse);

        // Check if image generation was successful
        if (imageResponse.data && imageResponse.data.data && imageResponse.data.data.length > 0) {
            const imageURL = imageResponse.data.data[0].url;

            // Update the dream entry with the new image URL
            const updatedDream = await Dream.findOneAndUpdate(
                { _id: dreamID },
                { $set: { imageURL } },
                { new: true }
            );

            if (!updatedDream) {
                return NextResponse.json({ message: "Dream update failed!" }, { status: 500 });
            }

            return NextResponse.json({ message: "Image generated and dream updated successfully", imageURL }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Image generation failed!" }, { status: 500 });
        }

    } catch (error) {
        console.error('error: ', error);
        return NextResponse.json({ message: "Error processing request!" }, { status: 500 });
    }
}
