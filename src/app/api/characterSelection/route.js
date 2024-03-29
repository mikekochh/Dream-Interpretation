import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Character from '../../../../models/characters';

export async function POST(req) {
    try {
        const { email, characterID } = await req.json();

        await connectMongoDB();
        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { characterID }}, { new: true });

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User character updated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User character selection failed!"}, { status: 500 })
    }
}

export async function GET(req) {
    try {
        const email = req.nextUrl.searchParams.get('email');
        await connectMongoDB();
        const user = await User.findOne({ email }).select("characterID"); 
        const character = await Character.findOne({ characterID: user.characterID });
        return NextResponse.json(character);
    }
    catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}