const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
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
        const { dreamPrompt } = req.query;

        try {
            logger.info('dreamPrompt: ', dreamPrompt);
            const dreamData = await interpretDream(dreamPrompt);
            logger.info('dreamData: ', dreamData);
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

// Scheduled function to run every night at midnight
exports.scheduledFunction = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
    logger.info('Scheduled function running at midnight');
    await client.connect();
    const db = client.db('dreamsite');
    const collection = db.collection('dreamStreaks');

    try {
        // Update documents where dreamedToday is true to set it to false
        await collection.updateMany(
            { dreamedToday: true },
            { $set: { dreamedToday: false } }
        );
        logger.info('Updated documents where dreamedToday was true');

        // Update documents where dreamedToday is false to reset streakLength to 0
        await collection.updateMany(
            { dreamedToday: false },
            { $set: { streakLength: 0 } }
        );
        logger.info('Updated documents where dreamedToday was false');

    } catch (error) {
        logger.error('Error updating dream streaks: ', error);
    } finally {
        await client.close();
    }

    return null;
});
