import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import { randomUUID } from 'crypto';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    await connectMongoDB();
    let newUser;

    try {
        // create user
        //find user
        const { email, name } = await req.json();

        const verificationTokenID = `${randomUUID()}-${randomUUID()}`.replace(/-/g, '');

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { verificationTokenID }}, { new: true });

        if (!updatedUser) {
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }

        // send email
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const verificationLink = `${domain}/activateReminder?verificationTokenID=${verificationTokenID}`;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "Confirm Dream Reminder",
            html: `
            <html>
                <body>
                    <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;">
                        <table style="width: 100%; text-align: center; margin: auto; background-color: #ffffff; border-radius: 10px; color: #000000; box-sizing: border-box; overflow: hidden;">
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
                                            Confirm Dream Reminder
                                        </div>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="text-align: center; color: #000000; padding: 5%; overflow: auto;">
                                    <h1 style="color: #000000;">Hi ${name}!</h1>
                                    <h3 style="color: #000000; padding: 20px;">To receive your dream reminder tomorrow morning and get your dream interpreted, please verify your email address (${email}) by clicking the link below. If you didn’t request this, you can safely ignore this email.</h3>
                                    <h3 style="color: #000000;"><a href="${verificationLink}">Verify Email Here!</a></h3>
                                    <h1 style="color: #000000;">Thank you for using Dream Oracles!</h1>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        return NextResponse.json({message: "Verification Email Sent!"}, { status: 200 })
    } catch (error) {
        console.log('error during reminder email: ', error);
        return NextResponse.json({message: "User email reminder failed!"}, { status: 500 })
    }
}