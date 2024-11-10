import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../../lib/mongodb';
import DreamComment from '../../../../../../models/dreamComment';
import User from '../../../../../../models/user';
import Dream from '../../../../../../models/dream';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    try {
        await connectMongoDB();
        // Get dream and dreamID from request
        const { dreamID, dreamComment } = await req.json();
        const dreamCommentDate = new Date();

        console.log("dreamID: ", dreamID);
        console.log("dreamComment: ", dreamComment);
        console.log("dreamCommentDate: ", dreamCommentDate);

        const insertDreamComment = await DreamComment.create({
            dreamID,
            dreamCommentContent: dreamComment,
            commentDate: dreamCommentDate
        });

        if (!insertDreamComment) {
            return NextResponse.json({ message: "Dream comment failed!" }, { status: 500 });
        }

        const dreamData = await Dream.findById(dreamID);

        if (!dreamData) {
            return NextResponse.json({ message: "Dream not found!" }, { status: 500 });
        }

        console.log("DreamData: ", dreamData);

        const userData = await User.findById(dreamData.userID);

        if (!userData) {
            return NextResponse.json({ message: "User not found for commenting email notification!" }, { status: 500 });
        }

        console.log("userData: ", userData);

        if (!userData.optOutEmailNotifications) {
            const fromAddress = process.env.EMAIL_FROM_ADDRESS;
            const domain = process.env.DOMAIN;
            const mailOptions = {
                from: `Dream Oracles <${fromAddress}`,
                to: userData.email,
                subject: "New Comment on Your Dream!",
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
                                                Dream Stream
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="text-align: center; color: #000000; padding: 5%; overflow: auto;">
                                        <h1 style="color: #000000;">Hello ${userData.name}!</h1>
                                        <h3 style="color: #000000;">Someone in the Dream Oracles community has shared their thoughts on your recent dream post! Dive in to see their comment and join the conversation:</h3>
                                        <h3><a href="${domain}/dreamDetails?dreamID=${dreamID}" style="color: #0000FF;">View Comment</a></h3>
                                        <h1 style="color: #000000;">Thank you for being part of Dream Oracles!</h1>
                                        <p style="color: #a9a9a9; font-size: 0.8em; font-weight: 300;">
                                            <a href="${domain}/profile" style="color: #0000FF; text-decoration: none;">Turn Off Email Notifications</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </body>
                </html>
                `
            };
    
            await sgMail.send(mailOptions)
        }

        return NextResponse.json({ message: "Dream comment successful!" }, { status: 200 });
    } catch (error) {
        console.error('error: ', error);
        return NextResponse.json({ message: "Error processing request!" }, { status: 500 });
    }
}
