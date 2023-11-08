import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectMongoDB();
        await User.create({ name, email, password:hashedPassword, credits: 10 });
        User.findOne

        return NextResponse.json({message: "User registered successfully!"}, { status: 200 })
    } catch (error) {
        return NextResponse.json({message: "User registration failed!"}, { status: 500 })
    }
}