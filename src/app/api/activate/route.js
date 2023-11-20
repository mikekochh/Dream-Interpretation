import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import { transporter } from '../../../../config/nodemailer';
import { randomUUID } from 'crypto';

export async function POST(req) {
    try {
        // create user
        const { activationTokenID } = await req.json();

        console.log('activationTokenID: ', activationTokenID);

        await connectMongoDB();

        const activatedUser = await User.findOneAndUpdate({ activationTokenID }, { $set: { activated: true }}, { new: true });

        if (!activatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "User activated successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}