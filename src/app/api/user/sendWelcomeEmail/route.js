import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {

    await connectMongoDB();

    try {
        const { email, name } = await req.json();

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const subscriptionLink = "/purchaseSubscription";
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Thank you for choosing Dream Oracles!",
            html: `
            <html>
                <body>
                    <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;">
                        <table style="width: 100%; margin: auto; background-color: #ffffff; border-radius: 10px; color: #000000; box-sizing: border-box; overflow: hidden;">
                            <tr>
                                <td style="background-color: #003366; padding: 0; color: #ffffff; font-size: 24px; max-height: 500px; position: relative; overflow: hidden;">
                                    <a href="https://www.dreamoracles.co" style="display: block; text-decoration: none;">
                                        <div style="position: absolute; top: 20px; left: 20px;">
                                            <div style="display: flex; align-items: center;">
                                                <img src="https://www.dreamoracles.co/dream_icon.webp" alt="Dream Oracles Logo" style="max-width: 40px; height: 40px; border-radius: 25%; margin-right: 10px; margin-left: 10px; margin-top: 10px;">
                                                <span style="font-size: 18px; color: #ffffff !important; line-height: 55px;">Dream Oracles</span>
                                            </div>
                                        </div>
                                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 40px; font-weight: bold; text-align: center; color: #ffffff;">
                                            Welcome!
                                        </div>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="text-align: left; color: #000000; padding: 20px; overflow: auto;">
                                    <h1 style="color: #000000;">Hello ${name}!</h1>
                                    <p style="color: black;">Welcome to Dream Oracles! 😁</p>
                                    <p style="color: black;">We’re thrilled that you’ve joined us and can’t wait to help you unlock the mysteries of your dreams.</p>
                                    <p style="color: black;">At Dream Oracles, we believe that dreams hold profound insights, and we’re here to provide the tools you need to explore and interpret them deeply.</p>
                                    <p style="color: black;">Since you’ve created an account, you now have access to an incredible range of features designed to enrich your experience:</p>
                                    <ul style="color: black; padding-left: 20px;">
                                        <li style="color: black; padding: 5px 0;"><strong>Unlimited Interpretations:</strong> Dive into unlimited access to our dream interpretation AI models.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Intuitive Questioning:</strong> Enrich your interpretation by answering questions about your dreams.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Community Interpretations:</strong> Connect with fellow dream enthusiasts for community-driven interpretations and insights.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Uncover Dream Symbols:</strong> Automatically discover symbols in your dreams and enhance your interpretations with our extensive dream dictionary.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Dream Image Generation:</strong> Visualize your dreams with AI-generated images created from your descriptions.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Intuitive Dream Journal:</strong> Securely store all your dreams, interpretations, and notes in your personal journal.</li>
                                    </ul>
                                    <p style="color: black;">Explore these powerful tools and take your dream journey to new heights with Dream Oracles. Let’s get started!</p>
                                    <h1 style="color: #000000;">Thank you for being a part of Dream Oracles!</h1>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>
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