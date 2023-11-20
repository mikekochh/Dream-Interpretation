import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import { transporter } from '../../../../config/nodemailer';
import { randomUUID } from 'crypto';

export async function POST(req) {
    try {
        // create user
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);

        const activationTokenID = `${randomUUID()}-${randomUUID()}`.replace(/-/g, '');

        await connectMongoDB();
        await User.create({ 
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

        const emailResult = await transporter.sendMail(mailOptions);

        console.log('Email sent: ', emailResult);

        return NextResponse.json({message: "User registered successfully!"}, { status: 200 })
    } catch (error) {
        return NextResponse.json({message: "User registration failed!"}, { status: 500 })
    }
}