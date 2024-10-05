import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    try {
        await connectMongoDB();

        const { email } = await req.json();

        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Dream Reminder",
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
                                            Dream Reminder
                                        </div>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="text-align: left; color: #000000; padding: 20px; overflow: auto;">
                                    <h1 style="color: #000000;">Good Morning!</h1>
                                    <p style="color: black;">Did you have a curious dream last night and wonder what it could mean?</p>
                                    <p style="color: black;">We're here to help you explore the insights hidden within your dreams.</p>
                                    <p style="color: black;">Click the link below to enter your dream into our interpretation software and uncover its meaning:</p>
                                    <h3 style="text-align: center;"><a href="${domain}/interpret" style="color: blue; text-decoration: underline;">Enter Your Dream</a></h3>
                                    <p style="color: black;">Wishing you a day filled with wonder and discovery!</p>
                                    <p style="color: black;">Warm regards,<br/>The Dream Oracles Team</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>
            `
        };        

        const emailResult = await sgMail.send(mailOptions);

        return NextResponse.json({message: "Reminder Email Sent!"}, { status: 200 });
    } catch (error) {
        console.log("There was an error sending reminder email : ", error);
        return NextResponse.json({message: "Sending reminder email failed!"}, { status: 500 });
    }
}