import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../lib/mongodb';
import User from '../../../../models/user';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
    await connectMongoDB();
    console.log("sending miss you emails...");

    try {
        const usersNotSubscribed = await User.find({
            $or: [
                { subscribed: false },
                { subscribed: { $exists: false } },
                { subscribed: null }
            ]
        });

        if (!usersNotSubscribed) {
            return NextResponse.json({message: "Users not found!"}, { status: 404 });
        }

        for (const user of usersNotSubscribed) {
            console.log("sending email to ", user.name);
            console.log("there email: ", user.email);
            console.log("\n");
            const fromAddress = process.env.EMAIL_FROM_ADDRESS;
            const domain = process.env.DOMAIN;
            const mailOptions = { 
                from: `Dream Oracles <${fromAddress}>`,
                to: user.email,
                subject: "We Miss You! Come Explore Your Dreams",
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
                                                Come Check Us Out
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" style="text-align: center; color: #000000; padding: 5%; overflow: auto;">
                                        <h1 style="color: #000000;">Hello ${user.name}!</h1>
                                        <p style="color: #000000; padding: 10px;">It’s been a while since we’ve seen you in the Dream Oracles community, and we’ve got some exciting updates to share!</p>
    
                                        <h2 style="color: #000000;">Completely Free For A Limited Time</h2>
                                        <p style="color: #000000; padding: 10px;">At Dream Oracles, we are rolling out our first official beta, and we want to give you all who have supported us on this journey access to our newly upgraded dream interpretation services for free. This beta will only be free for a limited time, so we ask that you use our services as much as possible during this period. Here are the exciting new features that we have launched in this beta:</p>
    
                                        <h2 style="color: #000000;">Conversational Interpretations (Biggest Update)</h2>
                                        <p style="color: #000000;">This is our most exciting feature yet! Unlike other AI-powered interpretation apps that simply let you input your dream with no further context, we’ve developed a process that actively engages you by asking insightful questions about your dream. This not only provides our AI models with richer context for more accurate interpretations, but also empowers you to reflect upon and uncover deeper interpretations on your own.</p>
                                        <p style="color: #000000;">At Dream Oracles, our mission isn’t to tell you what your dreams mean – it’s to guide you on a journey of self-discovery and personal growth. We’re thrilled about this new feature and believe it is a groundbreaking improvement in our interpretation software, one that will be a valuable tool in helping you better understand your dreams and, ultimately, yourself.</p>
    
                                        <h2 style="color: #000000;">Dream Stream (Community)</h2>
                                        <p style="color: #000000;">You can now share your dreams with our community. This will allow others to comment on your dream and to have exciting conversations with other dreamers!</p>
    
                                        <h2 style="color: #000000;">Dream Image Generation</h2>
                                        <p style="color: #000000;">We are now turning your dreams into images! Using AI, we are able to create beautiful images from the most exciting parts of your dreams.</p>
    
                                        <p style="color: #000000;">If any of these new feature interest you at all, check us out! We will be happy to see you back on the platform, and are excited for you to try out our improved system. We only ask that during this beta while you use our services, you leave us feedback on the platform. Are your interpretations coming out good? What features would you want to see in the future from Dream Oracles? Any feedback that you might have to make Dream Oracles better would be greatly appreciated!</p>
    
                                        <h2 style="color: #000000;">Don’t miss out on this chance to dive deeper into your dreams and see what they’re really trying to tell you.</h2>
                                        <h1 style="color: #000000;">Thank you for Choosing Dream Oracles!</h1>
    
                                        <!-- Link at the bottom -->
                                        <h3 style="color: #0000FF;">
                                            <a href="${domain}/interpret" style="text-decoration: underline; color: #0000FF;">
                                                Explore Dream Oracles & Interpret Your Dreams
                                            </a>
                                        </h3>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </body>
                </html>
                `
            };

            const emailResult = await sgMail.send(mailOptions);
    
            console.log("emailResult: ", emailResult);
        }

        return NextResponse.json({message: "Verification Email Sent!"}, { status: 200 });
    } catch (error) {
        console.log('error during reminder email: ', error);
        return NextResponse.json({message: "User email reminder failed!"}, { status: 500 });
    }
}
