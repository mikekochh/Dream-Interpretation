import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import Dream from '../../../../models/dream';
import Interpretation from '../../../../models/interpretation';
import { randomUUID } from 'crypto';
import sgMail from '@sendgrid/mail';
const mongoose = require('mongoose');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    await connectMongoDB();
    let newUser;

    try {
        // create user
        //find user
        console.log("We are getting to this new API endpoint!");
        const { email, dreamID } = await req.json();

        const verificationTokenID = `${randomUUID()}-${randomUUID()}`.replace(/-/g, '');

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { verificationTokenID }}, { new: true });

        if (!updatedUser) {
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }

        const data = await User.findOne({ email }).select("name");

        if (!data) {
            return NextResponse.json({message: "User not found!"}, { status: 404 })
        }


        // send the email once the interpretation is complete. Then, the email will say, your interpretation is complete
        // please verify your email address using the link below to see your interpretation

        // at this point, we want to get their dreamID, and wait for the interpretation to be ready.
        // once the interpretation is ready, we will then send the email out
        const dream = await Dream.findById({ _id: dreamID });

        if (!dream) {
            return NextResponse.json({ message: "Dream not found!" }, { status: 404 })
        }

        const timeoutDuration = 60000;

        try {
            const interpretation = await checkForInterpretation(dreamID, timeoutDuration);
            // console.log("the interpretation: ", interpretation);

            // send email
            const fromAddress = process.env.EMAIL_FROM_ADDRESS;
            const domain = process.env.DOMAIN;
            // const interpretationText = interpretation.interpretation;
            const verificationLink = `${domain}/activate?verificationTokenID=${verificationTokenID}`;
            const mailOptions = { 
                from: `Dream Oracles <${fromAddress}>`,
                to: email,
                subject: "Your Interpretation is Ready!",
                html: `
                <html>
                    <body>
                        <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;">
                            <table style="width: 100%; max-width: 500px; text-align: center; margin: auto; background-color: #ffffff; border-radius: 10px; color: #000000; box-sizing: border-box;">
                                <tr>
                                    <td style="background-color: #003366; padding: 0; color: #ffffff; font-size: 24px; max-height: 500px; position: relative;">
                                        <a href="https://www.dreamoracles.co" style="display: block; text-decoration: none;">
                                            <div style="position: absolute; top: 20px; left: 20px;">
                                                <div style="display: flex; align-items: center;">
                                                    <img src="https://www.dreamoracles.co/dream_icon.webp" alt="Dream Oracles Logo" style="max-width: 40px; height: 40px; border-radius: 25%; margin-right: 10px; margin-left: 10px; margin-top: 10px;">
                                                    <span style="font-size: 18px; color: #ffffff !important; line-height: 55px;">Dream Oracles</span>
                                                </div>
                                            </div>
                                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 40px; font-weight: bold; text-align: center; color: #ffffff;">
                                                Verify Email
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="text-align: center; color: #000000; padding: 20px;">
                                        <h1 style="color: #000000;">Hi ${data.name}!</h1>
                                        <p style="color: #000000;">First of all, thank you for using Dream Oracles! To view your dream interpretation, please verify your email address by clicking the link below:</p>
                                        <p><a href="${verificationLink}" style="color: #0000FF;">${verificationLink}</a></p>
                                        <p style="color: #000000;">Once verified, you will be redirected to your dream interpretation.</p>
                                        <p style="color: #000000;">If you did not request this email, you can safely ignore it.</p>
                                        <p style="color: #000000;">Thank you,<br/>
                                        The Dream Oracles Team</p>
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
            console.error(error.message);
            return NextResponse.json({ message: "Interpretation not found within the time limit"});
        }
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


const checkForInterpretation = async (dreamID, timeoutDuration) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: No interpretation found within the time limit')), timeoutDuration)
    );

    const check = async () => {
        while (true) {
            const interpretation = await Interpretation.findOne({ dreamID });

            if (interpretation) {
                console.log('Interpretation found:', interpretation);
                return interpretation;
            }

            console.log('No interpretation found yet, checking again in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    };

    return Promise.race([check(), timeout]);
};