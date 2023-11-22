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

        const verificationTokenID = `${randomUUID()}-${randomUUID()}`.replace(/-/g, '');

        const passwordResetUser = await User.findOneAndUpdate({ email }, { $set: { verificationTokenID }}, { new: true });

        console.log('passwordResetUser: ', passwordResetUser);

        if (!passwordResetUser) {
            console.log('User not found!');
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }

        const data = await User.findOne({ email }).select("name");

        if (!data) {
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const passwordResetLink = `${domain}/updatePassword?verificationTokenID=${verificationTokenID}`;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Reset Password",
            html: `
                <h1>Hi ${data.name}!</h1>
                <p>Please follow the link below to reset your password. If you did not request this link, you can safely ignore this email.</p>
                <p><a href="${passwordResetLink}">${passwordResetLink}</a></p>
                <p>Thank you,<br/>
                The Dream Oracles</p>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        console.log('Email sent: ', emailResult);

        return NextResponse.json({message: "Password Reset Email Sent Successfully!"}, { status: 200 })
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