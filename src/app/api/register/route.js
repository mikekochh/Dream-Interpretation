import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';

export async function POST(req) {

    await connectMongoDB();
    let newUser;

    try {
        // create user
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            credits: 5, 
            activated: false,
            verificationTokenID: null
        });

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