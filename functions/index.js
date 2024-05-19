const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });

// below command line is to update function in firebase
// firebase login
// firebase deploy --only functions


admin.initializeApp();

const openai = new OpenAI({
    apiKey: functions.config().openai.api_key,
});

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
            res.status(500).json({ error });
        }
    });

});


async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{role: "user", content: dream}],
    })
    logger.info('chatCompletion: ', chatCompletion);

    return chatCompletion.choices;
}