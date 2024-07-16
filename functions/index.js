const admin = require('firebase-admin');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });
const { MongoClient } = require('mongodb');

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
            await client.connect()
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
                })
    
                logger.info("the new interpretation: ", newInterpretation);
    
                if (!newInterpretation) {
                    throw new Error('Interpretation creation failed!');
                }
    
                await interpretationCounter.findOneAndUpdate({
                    _id: "65a58ab10d04881df7e5a2a7",
                }, {
                    $inc: { counter: 1 }
                })
    
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

