import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from '../../../../../models/user';
import Dream from '../../../../../models/dream';
import Oracle from '../../../../../models/oracles';
import MetaAnalysis from '../../../../../models/metaAnalysis';
import axios from 'axios';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    try {
        const users = await User.find({ subscribed: true });

        for (let i = 0; i < users.length; i++) {
            // if they have an email, and their is an oracle selected
            console.log("email: ", users[i].email);
            console.log("meta analysis oracle: ", users[i].metaAnalysisOracleID);
            if (users[i].email && users[i].metaAnalysisOracleID && users[i].metaAnalysisOracleID !== 0) {
                const user = users[i];
                const oracle = await Oracle.findOne({ oracleID: user.metaAnalysisOracleID });

                const today = new Date();
                const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);

                const userWeeklyDreams = await Dream.find({ userID: user._id, dreamDate: { $gte: startOfWeek, $lt: endOfWeek } });

                let dreamsOfTheWeek = [];

                userWeeklyDreams.forEach(dream => {
                    dreamsOfTheWeek.push("```\n" + dream.dream);
                })

                let fullMetaAnalysisPrompt = oracle.oracleMetaAnalysisPrompt + "\n" + 
                    "Do not introduce yourself, just get straight into the meta-analysis. At the end of the meta analysis, write a summary and overarching theme section, which is one section. Begin each paragraph with a title, and each title, and only the titles, should be listed like this:" + "\n" +
                    "**The Title**" + "\n" + "Do not bold anything else but the titles. Here are the dreams:" + "\n\n" + dreamsOfTheWeek.join("\n\n");

                const resInterpret = await axios.get('https://us-central1-dream-oracles.cloudfunctions.net/dreamLookup',
                {
                    params: {
                        dreamPrompt: fullMetaAnalysisPrompt
                    }
                });

                const metaAnalysis = resInterpret.data[0].message.content;

                const formattedMetaAnalysisText = formatMetaAnalysisText(metaAnalysis);

                const fromAddress = process.env.EMAIL_FROM_ADDRESS;
                const domain = process.env.DOMAIN;
                const mailOptions = { 
                    from: `Dream Oracles <${fromAddress}>`,
                    to: user.email,
                    subject: "You're weekly dream meta analysis",
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
                                                    Dream Meta Analysis
                                                </div>
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style="text-align: center; color: #000000; padding: 20px;">
                                            <h1 style="color: #000000;">Good morning ${user.name},</h1>
                                            <h3 style="color: #000000;">Happy Sunday! Below is your weekly dream meta analysis from ${oracle.oracleName} on your dreams from the previous week. If you would like to update your dream meta analysis oracle, please visit your <a href="${domain}/settings" style="color: #0000FF;">profile</a>.</h3>
                                            <h3 style="color: #000000;">Otherwise, we hope you enjoy your meta analysis from ${oracle.oracleName} and hope you have a great week :)</h3>
                                            <hr style="border: none; border-top: 1px solid #000000; margin: 20px 0;">
                                            <div style="color: #000000;">${formattedMetaAnalysisText}</div>
                                            <h1 style="color: #000000;">Thank you for choosing Dream Oracles!</h1>
                                            <img src="https://www.dreamoracles.co${oracle.oraclePicture}" alt="Oracle Picture" style="max-width: 250px; height: auto; border-radius: 10%;">
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </body>
                    </html>
                    `
                };
        
                const emailResult = await sgMail.send(mailOptions);

                const metaAnalysisSummary = metaAnalysis.trim().split('\n').pop();

                const metaAnalysisEntry = await MetaAnalysis.create({
                    userID: user._id,
                    oracleID: oracle.oracleID,
                    metaAnalysis: metaAnalysis,
                    metaAnalysisDate: new Date(),
                    metaAnalysisSummary: metaAnalysisSummary
                });                

                if (!metaAnalysisEntry) {
                    throw new Error("Failed to save meta analysis to database");
                }
            }
        }

        return NextResponse.json({message: "All user dream meta analyses successfully completed!"}, { status: 200 })
    } catch (error) {
        console.log('error during meta analysis: ', error);
        return NextResponse.json({message: "User dream meta analysis failed!"}, { status: 500 })
    }
}

function formatMetaAnalysisText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<h2 style="margin-bottom: 5px;">$1</h2>') // Replace **text** with <h3>text</h3> and set margin-bottom to reduce space
        .replace(/\n\n/g, '<br>') // Replace double newlines with <br> for paragraphs
        .replace(/\n/g, ''); // Remove remaining single newlines
}
