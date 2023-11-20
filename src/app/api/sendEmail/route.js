import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import { transporter } from '../../../../config/nodemailer';


export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 12);
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;

        console.log("fromAddress: ", fromAddress);

        console.log("name: ", name);
        console.log("email: ", email);
        console.log("password: ", password);

        const verificationLink = 'https://www.youtube.com/watch?v=Xty2gi5cMa8';

        await connectMongoDB();

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

        // const emailResult = await transporter.sendMail(mailOptions);

        // console.log('Email sent: ', emailResult);

        return NextResponse.json({message: "User registered successfully!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User registration failed!"}, { status: 500 })
    }
}

export async function GET(request) {
    try {
        const email = request.nextUrl.searchParams.get('email');
        console.log('email: ', email);
        await connectMongoDB();
        const activated = await User.findOne({ email }).select("activated");
        console.log('activated: ', activated);
        return NextResponse.json(activated);
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.error(error);
    }
}