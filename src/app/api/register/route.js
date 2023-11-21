import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import { transporter } from '../../../../config/nodemailer';
import { randomUUID } from 'crypto';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {

    await connectMongoDB();
    let newUser;

    try {
        // create user
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        const activationTokenID = `${randomUUID()}-${randomUUID()}`.replace(/-/g, '');

        newUser = await User.create({ 
            name, 
            email, 
            password:hashedPassword, 
            credits: 8, 
            redeemedCredits: false, 
            activated: false,
            activationTokenID
        });

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const verificationLink = `${domain}/activate?activationTokenID=${activationTokenID}`;
        const mailOptions = { 
            from: `"Dream Oracles" <${fromAddress}>`,
            to: email,
            subject: "Verify your email address",
            html: `
                <h1>Hi ${name}!</h1>
                <p>Please verify your email address ${email} using the link below. If you did not request this link, you can safely ignore this email.</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p>Thank you,<br/>
                The Dream Oracles</p>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        console.log('Email sent: ', emailResult);

        return NextResponse.json({message: "User registered successfully!"}, { status: 200 })
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