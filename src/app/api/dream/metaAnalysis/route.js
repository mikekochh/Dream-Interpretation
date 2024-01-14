import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';
import Dream from '../../../../../models/dream';
import Oracle from '../../../../../models/oracles';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    try {
        const { email } = await req.json();

        await connectMongoDB();
        const user = await User.findOne({ email: email });
        const oracle = await Oracle.findOne({ oracleID: user.metaAnalysisOracleID });

        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const dreams = await Dream.find({ userID: user._id, dreamDate: { $gte: startOfWeek, $lt: endOfWeek } });
        let dreamsOfTheWeek = [];

        dreams.forEach(dream => {
            dreamsOfTheWeek.push("```\n" + dream.dream);
        });

        let fullDreamDetails = oracle.oracleMetaAnalysisPrompt + "\n\n" + dreamsOfTheWeek.join("\n\n");

        const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
        {
            params: {
                dreamPrompt: fullDreamDetails
            }
        });

        const metaAnalysis = resInterpret.data[0].message.content;

        const formattedMetaAnalysis = metaAnalysis.replace(/\n/g, "<br/>");

        // const formattedMetaAnalysis = "testing long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetesting long messagetes"

        const pictureSource = process.env.DOMAIN + oracle.oraclePicture;
        const fromAddress = process.env.EMAIL_FROM_ADDRESS;
        const domain = process.env.DOMAIN;
        const mailOptions = { 
            from: `Dream Oracles <${fromAddress}>`,
            to: email,
            subject: "You're weekly dream meta analysis",
            html: `
                <table width="100%">
                    <tr>
                        <td valign="top">
                            <h1>Good morning ${user.name},</h1>
                            <h2>Below is your Sunday meta analysis from ${oracle.oracleName} on last weeks dreams:</h2>
                            <h3>${formattedMetaAnalysis}</h3>
                            <h2>If you would like to change your dream meta analysis oracle, please visit your <a href="${domain}/settings">profile</a>.</h2>
                            <h2>If there is anything you would like to recommend to be included in the weekly dream meta analysis, please provide your feedback <a href="${domain}/feedback">here</a>.
                            Any feedback is greatly appreciated!</h2>
                            <h1>Thank you for choosing Dream Oracles 😄</h1>
                            <img src="https://www.dreamoracles.co${oracle.oraclePicture}" alt="Oracle Picture" style="max-width: 250px; height: auto; border-radius: 25%;">
                        </td>
                    </tr>
                </table>
            `
        };

        const emailResult = await sgMail.send(mailOptions);

        return NextResponse.json({message: "User dream meta analysis successful!"}, { status: 200 })
    } catch (error) {
        console.log('error during meta analysis: ', error);
        return NextResponse.json({message: "User dream meta analysis failed!"}, { status: 500 })
    }
}