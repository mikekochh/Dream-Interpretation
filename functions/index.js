const admin = require('firebase-admin');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });
const { MongoClient } = require('mongodb');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

// Set SendGrid API key
sgMail.setApiKey(functions.config().sendgrid.api_key);

// Initialize Firebase Admin SDK
admin.initializeApp();

const openai = new OpenAI({
    apiKey: functions.config().openai.api_key,
});

const uri = functions.config().mongodb.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.dreamLookup = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { dreamPrompt, dreamID, oracleID } = req.query;

        try {
            await client.connect();
            const db = client.db('dreamsite');
            const interpretations = db.collection('interpretations');
            const interpretationCounter = db.collection('interpretationcounters');
            logger.info('dreamPrompt: ', dreamPrompt);
            logger.info('dreamID: ', dreamID);
            logger.info("oracleID: ", oracleID);
            const dreamData = await interpretDream(dreamPrompt);
            logger.info('dreamData: ', dreamData);
            logger.info("the interpretation: ", dreamData[0].message.content);

            if (dreamID && oracleID) {
                const newInterpretation = await interpretations.insertOne({
                    dreamID,
                    oracleID,
                    interpretation: dreamData[0].message.content,
                    interpretationDate: new Date()
                });

                logger.info("the new interpretation: ", newInterpretation);

                if (!newInterpretation) {
                    throw new Error('Interpretation creation failed!');
                }

                await interpretationCounter.findOneAndUpdate({
                    _id: "65a58ab10d04881df7e5a2a7",
                }, {
                    $inc: { counter: 1 }
                });

                if (!interpretationCounter) {
                    console.log('Interpretation counter update failed!');
                }
            }

            res.status(200).json(dreamData);
        } catch (error) {
            logger.error('Error: ', error);
            res.status(500).json({ error: error.message });
        }
    });
});

async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: dream }],
    });
    logger.info('chatCompletion: ', chatCompletion);

    return chatCompletion.choices;
}

// Scheduled function to run every night at midnight for dream streaks
exports.scheduledFunction = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
    logger.info('Scheduled function running at midnight');
    await client.connect();
    const db = client.db('dreamsite');
    const collection = db.collection('dreamstreaks');

    try {
        const updateFalseResult = await collection.updateMany(
            { dreamedToday: false },
            { $set: { streakLength: 0 } }
        );
        logger.info('Updated documents where dreamedToday was false', updateFalseResult);

        const updateTrueResult = await collection.updateMany(
            { dreamedToday: true },
            { $set: { dreamedToday: false } }
        );
        logger.info('Updated documents where dreamedToday was true', updateTrueResult);

    } catch (error) {
        logger.error('Error updating dream streaks: ', error);
    } finally {
        await client.close();
    }

    return null;
});

// New Scheduled function to run every Sunday at midnight
exports.weeklyDreamMetaAnalysis = functions.pubsub.schedule('every sunday 00:00').onRun(async (context) => {
    logger.info('Weekly Dream Meta Analysis Function running');

    try {
        await client.connect();
        const db = client.db('dreamsite');
        const usersCollection = db.collection('users');
        const dreamsCollection = db.collection('dreams');
        const oraclesCollection = db.collection('oracles');
        const metaAnalysisCollection = db.collection('metaAnalysis');

        const users = await usersCollection.find({ subscribed: true }).toArray();

        for (let i = 0; i < users.length; i++) {
            if (users[i].email && users[i].metaAnalysisOracleID && users[i].metaAnalysisOracleID !== 0) {
                const user = users[i];
                const oracle = await oraclesCollection.findOne({ oracleID: user.metaAnalysisOracleID });

                const today = new Date();
                const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);

                const userWeeklyDreams = await dreamsCollection.find({ userID: user._id, dreamDate: { $gte: startOfWeek, $lt: endOfWeek } }).toArray();

                let dreamsOfTheWeek = [];

                userWeeklyDreams.forEach(dream => {
                    dreamsOfTheWeek.push("```\n" + dream.dream);
                });

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

                const fromAddress = 'noreply@dreamoracles.co';
                const domain = 'https://www.dreamoracles.co';
                const mailOptions = {
                    from: `Dream Oracles <${fromAddress}>`,
                    to: user.email,
                    subject: "Your weekly dream meta analysis",
                    html: `
                    <html>
                        <body>
                            <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;">
                                <table style="width: 100%; max-width: 500px; text-align: center; margin: auto; background-color: #ffffff; border-radius: 10px; color: #000000; box-sizing: border-box;">
                                    <tr>
                                        <td style="background-color: #003366; padding: 0; color: #ffffff; font-size: 24px; max-height: 500px; position: relative;">
                                            <a href="${domain}" style="display: block; text-decoration: none;">
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
                                        <td valign="top" style="text-align: left; color: #000000; padding: 5%;">
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

                await sgMail.send(mailOptions);

                const metaAnalysisSummary = metaAnalysis.trim().split('\n').pop();

                const metaAnalysisEntry = await metaAnalysisCollection.insertOne({
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

        logger.info("All user dream meta analyses successfully completed!");

    } catch (error) {
        logger.error('Error during meta analysis: ', error);
    } finally {
        await client.close();
    }
});

function formatMetaAnalysisText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<h2 style="margin-bottom: 5px;">$1</h2>') // Replace **text** with <h3>text</h3> and set margin-bottom to reduce space
        .replace(/\n\n/g, '<br>') // Replace double newlines with <br> for paragraphs
        .replace(/\n/g, ''); // Remove remaining single newlines
}
