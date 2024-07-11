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

        // at this point, we want to get their dreamID, and wait for the interpretation to be ready.
        // once the interpretation is ready, we will then send the email out
        const dream = await Dream.findById({ _id: dreamID });

        if (!dream) {
            return NextResponse.json({ message: "Dream not found!" }, { status: 404 })
        }

        const timeoutDuration = 60000;

        try {
            const interpretation = await checkForInterpretation(dreamID, timeoutDuration);
            console.log("the interpretation: ", interpretation);

            // send email
            const fromAddress = process.env.EMAIL_FROM_ADDRESS;
            const domain = process.env.DOMAIN;
            const interpretationText = interpretation.interpretation;
            const verificationLink = `${domain}/activate?verificationTokenID=${verificationTokenID}`;
            const mailOptions = { 
                from: `Dream Oracles <${fromAddress}>`,
                to: email,
                subject: "Your First Interpretation!",
                html: `
                    <h1>Hi ${data.name}!</h1>
                    <p>First of all, welcome to Dream Oracles! We are very happy to have you hear and are excited for you to read your interpretation.</p>
                    <p>Below is your interpretation. To continue using our application you must verify your email address by clicking the link at the bottom of this page.</p>
                    <p>If you did not request this email, you can safely ignore it.</p>
                    <p>Here is your dream interpretation: </p>
                    <p>${interpretationText}</p>
                    <p><a href="${verificationLink}">${verificationLink}</a></p>
                    <p>Thank you,<br/>
                    The Dream Oracles Team</p>
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