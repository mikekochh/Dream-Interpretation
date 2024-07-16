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
        const subscriptionLink = "/purchaseSubscription";
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Welcome to Dream Oracles!",
            html: `
                <h1>Hello ${name}!</h1>
                <p>Welcome to Dream Oracles!! 😁</p>
                <p>We are very happy that you are here and are excited to help you on your journey of understanding your dreams.</p>
                <p>At Dream Oracles, we believe that dreams are a sacred and special phenomenon within humans, and it is important to have tools to properly explore your dreams.</p>
                <p>To make the most of your experience, we invite you to <a href="${domain}${subscriptionLink}">start a subscription</a> and unlock all of the powerful features Dream Oracles has to offer:</p>
                <ul>
                    <li><strong>Unlimited Interpretations:</strong> Gain unlimited access to all of our dream interpretation AI models.</li>
                    <li><strong>Intelligent Dream Oracles:</strong> Select from our ever-growing list of 5+ Dream Oracles, each offering a unique perspective on your dreams.</li>
                    <li><strong>Intuitive Dream Journal:</strong> All of your dreams, interpretations, and notes securely stored in your personal dream journal.</li>
                    <li><strong>Mood Recording:</strong> Capture the emotions you experienced during your dreams and incorporate them into the interpretation for deeper insights.</li>
                    <li><strong>Incorporate Personality Details:</strong> Update your profile to include age, gender, cultural background, and spiritual views for more personalized interpretations.</li>
                </ul>
                <p><a href="${domain}${subscriptionLink}">Start your subscription today</a> to take full advantage of these features and truly explore the depths of your dreams with Dream Oracles!</p>
                <p>Thank you,<br/>
                The Dream Oracles Team</p>
            `
        };

        // we hope you enjoyed your first interpretation

        const emailResult = await sgMail.send(mailOptions);

        return NextResponse.json({message: "Welcome Email Sent!"}, { status: 200 })
    } catch (error) {
        console.log('error welcome email: ', error);
        return NextResponse.json({message: "Sending Welcome Email Failed!"}, { status: 500 })
    }
}