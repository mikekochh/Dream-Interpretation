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
                                            You Are Subscribed!
                                        </div>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="text-align: left; color: #000000; padding: 20px; overflow: auto;">
                                    <h1 style="color: black;">Hello ${data.name}!</h1>
                                    <p style="color: black;">Congratulations on becoming a new Dream Oracles member!! 😁</p>
                                    <p style="color: black;">We're absolutely thrilled to have you on board and are extremely grateful that you choose us to help you on the journey of understanding your dreams.</p>
                                    <p style="color: black;">As a member of Dream Oracles, you can now enjoy:</p>
                                    <ul style="color: black;">
                                        <li style="color: black;"><strong>Unlimited Interpretations:</strong> Dive deep into your dreams with unlimited access to our advanced dream interpretation AI models.</li>
                                        <li style="color: black;"><strong>Intelligent Dream Oracles:</strong> Choose from our diverse range of Dream Oracles, each offering unique perspectives and insights.</li>
                                        <li style="color: black;"><strong>Weekly Meta Analysis:</strong> Discover recurring themes and patterns in your dreams and decipher them with our advanced dream meta-analysis feature.</li>
                                        <li style="color: black;"><strong>Intuitive Dream Journal:</strong> Securely store all your dreams, interpretations, and notes in your personal dream journal.</li>
                                        <li style="color: black;"><strong>Mood Recording:</strong> Track the emotions you experience during your dreams for deeper, more insightful interpretations.</li>
                                        <li style="color: black;"><strong>Personalized Interpretations:</strong> Tailor your dream analysis by updating your profile with details like age, gender, cultural background, and spiritual views.</li>
                                    </ul>
                                    <p style="color: black;">Once you have updated your profile (you can do that <a href="${domain}/settings" style="color: blue; text-decoration: underline;">here</a>), our Dream Oracles will begin to incorporate your personality details provided into the interpretations, making your dream analyses deeper and richer.</p>
                                    <p style="color: black;">Thank you for trusting us to help you navigate the fascinating world of dreams. We're here to support you on this journey every step of the way.</p>
                                    <p style="color: black;">If you have any questions, need assistance, or have feedback for us, please do not hesitate to reach out. You can contact us <a href="${domain}/feedback" style="color: blue; text-decoration: underline;">here</a>.</p>
                                    <p style="color: black;">Otherwise, thank you again for joining the Dream Oracles family, and we can't wait to help you uncover the mysteries of your dreams.</p>
                                    <h1 style="color: #000000;">Thank you for choosing Dream Oracles!</h1>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>
            `
        };
        

        await sgMail.send(mailOptions);

        await User.findOneAndUpdate({ email }, { communityAccess: true }, { new: true });

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