import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import { randomUUID } from 'crypto';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {

    await connectMongoDB();
    let newUser;

    try {
        // create user
        //find user
        const { email } = await req.json();

        const data = await User.findOne({ email });

        if (!data) {
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Welcome to Dream Oracles!",
            html: `
                <h1>Hi ${data.name}!</h1>
                <p>Thank you for joining our telegram community!</p>
                <p>Here is the link to join: <a href="https://t.me/+BMpaqL8vSzUwZjBh">https://t.me/+BMpaqL8vSzUwZjBh</a></p>
                <p>Thank you,<br/>
                The Dream Oracles</p>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        const updatedUser = await User.findOneAndUpdate({ email }, { communityAccess: true }, { new: true });

        return NextResponse.json({message: "Telegram email sent!"}, { status: 200 })
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