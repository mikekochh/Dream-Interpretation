import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';
import bcrypt from 'bcryptjs';
import { SIGN_UP_TYPE_E_BOOK } from '@/types/signUpTypes';

export const maxDuration = 60;

export async function POST(req) {

    await connectMongoDB();
    let newUser;

    try {
        // create user
        const { name, email } = await req.json();
        const password = "password";
        const hashedPassword = await bcrypt.hash(password, 12);

        newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            activated: false,
            verificationTokenID: null,
            usedFreeDream: false,
            signUpTypeID: SIGN_UP_TYPE_E_BOOK
        });

        // we also need to set up an email that gets sent out here to give them the link to the e book

        return NextResponse.json({newUser}, { status: 200 });
    } catch (error) {
        console.log('error during registration: ', error);

        if (newUser && newUser._id) {
            try {
                await User.deleteOne({ _id: newUser._id });
                console.log('Rolling back user creation');
            } catch (deleteError) {
                console.log('error during rollback: ', deleteError);
            }
        }

        return NextResponse.json({message: "User registration failed!"}, { status: 500 })
    }
}