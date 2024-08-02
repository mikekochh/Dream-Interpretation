import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import sgMail from '@sendgrid/mail';
import { getNamedMiddlewareRegex } from 'next/dist/shared/lib/router/utils/route-regex';

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
                                    <p style="color: black;">Welcome to Dream Oracles!! 😁</p>
                                    <p style="color: black;">We are very happy that you are here and are excited to help you on your journey of understanding your dreams.</p>
                                    <p style="color: black;">At Dream Oracles, we believe that dreams are a sacred and special phenomenon within humans, and it is important to have tools to properly explore your dreams.</p>
                                    <p style="color: black;">To make the most of your experience, we invite you to <a href="${domain}${subscriptionLink}" style="color: blue; text-decoration: underline;">start a subscription</a> and unlock all of the powerful features Dream Oracles has to offer:</p>
                                    <ul style="color: black; padding-left: 20px;">
                                        <li style="color: black; padding: 5px 0;"><strong>Unlimited Interpretations:</strong> Gain unlimited access to all of our dream interpretation AI models.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Intelligent Dream Oracles:</strong> Select from our ever-growing list of 5+ Dream Oracles, each offering a unique perspective on your dreams.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Weekly Meta Analysis:</strong> Discover recurring themes and patterns in your dreams and decipher them with our advanced dream meta-analysis feature.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Intuitive Dream Journal:</strong> All of your dreams, interpretations, and notes securely stored in your personal dream journal.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Mood Recording:</strong> Capture the emotions you experienced during your dreams and incorporate them into the interpretation for deeper insights.</li>
                                        <li style="color: black; padding: 5px 0;"><strong>Incorporate Personality Details:</strong> Update your profile to include age, gender, cultural background, and spiritual views for more personalized interpretations.</li>
                                    </ul>
                                    <p style="color: black;"><a href="${domain}${subscriptionLink}" style="color: blue; text-decoration: underline;">Start your subscription today</a> to take full advantage of these features and truly explore the depths of your dreams with Dream Oracles!</p>
                                    <h1 style="color: #000000;">Thank you for choosing Dream Oracles!</h1>
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