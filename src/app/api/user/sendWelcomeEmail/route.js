import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {

    await connectMongoDB();
    let newUser;

    try {
        const { email, name } = await req.json();

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Welcome to Dream Oracles!",
            html: `
            <h1>Hello ${name}!</h1>
            <p>Welcome to Dream Oracles!! 😁</p>
            <p>We are very happy that you are here and are excited to help you on your journey of understanding your dreams.</p>
            <p>At Dream Oracles, we believe that dreams are a sacred and special phenomena within humans, and it is important to have tools and a community that is ready to explore your dreams with you.</p>
            <p>Here's what you should expect from creating an account with Dream Oracles:</p>
            <ol>
                <li>Journaling technology to keep track of all of your dreams in an organized manner</li>
                <li>Personalized dream interpretations using cutting-edge AI technology</li>
                <li>An ever-growing community of fellow dreamers ready to help you on your journey of exploring the unconscious mind</li>
            </ol>
            <p>If you haven't already, make sure to pop on over to the <a href="${domain}/settings">profile page</a>, where you can add more details about yourself. These details are optional, but they can be helpful in making your interpretations more personalized and help us understand who you are better.</p>
            <p>Either way, we want to thank you again for choosing Dream Oracles. Let's uncover the mystery of your dreams!</p>
            <p>Thank you,<br/>
            The Dream Oracles Team</p>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        return NextResponse.json({message: "Welcome Email Sent!"}, { status: 200 })
    } catch (error) {
        console.log('error welcome email: ', error);
        return NextResponse.json({message: "Sending Welcome Email Failed!"}, { status: 500 })
    }
}