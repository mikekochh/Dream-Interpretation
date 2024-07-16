import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
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
                <h1 style="color: black;">Hello ${data.name}!</h1>
                <p style="color: black;">Congratulations on starting your Dream Oracles subscription!! 😁</p>
                <p style="color: black;">We're absolutely thrilled to have you on board and are extremely grateful that you choose us to help you on the journey of understanding your dreams.</p>
                <p style="color: black;">As a member of Dream Oracles, you can now enjoy:</p>
                <ul style="color: black;">
                    <li style="color: black;"><strong>Unlimited Interpretations:</strong> Dive deep into your dreams with unlimited access to our advanced dream interpretation AI models.</li>
                    <li style="color: black;"><strong>Intelligent Dream Oracles:</strong> Choose from our diverse range of Dream Oracles, each offering unique perspectives and insights.</li>
                    <li style="color: black;"><strong>Intuitive Dream Journal:</strong> Securely store all your dreams, interpretations, and notes in your personal dream journal.</li>
                    <li style="color: black;"><strong>Mood Recording:</strong> Track the emotions you experience during your dreams for deeper, more insightful interpretations.</li>
                    <li style="color: black;"><strong>Personalized Interpretations:</strong> Tailor your dream analysis by updating your profile with details like age, gender, cultural background, and spiritual views.</li>
                </ul>
                <p style="color: black;">Once you have updated your profile (you can do that <a href="${domain}/settings" style="color: blue; text-decoration: underline;">here</a>), our Dream Oracles will begin to incorporate your personality details provided into the interpretations, making your dream analyses deeper and richer.</p>
                <p style="color: black;">Thank you for trusting us to help you navigate the fascinating world of dreams. We're here to support you on this journey every step of the way.</p>
                <p style="color: black;">If you have any questions, need assistance, or have feedback for us, please do not hesitate to reach out. You can contact us <a href="${domain}/feedback" style="color: blue; text-decoration: underline;">here</a>.</p>
                <p style="color: black;">Otherwise, thank you again for joining the Dream Oracles family, and we can't wait to help you uncover the mysteries of your dreams.</p>
                <p style="color: black;">Happy exploring!<br/>
                The Dream Oracles Team</p>
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