const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const openai = new OpenAI({
    apiKey: functions.config().openai.api_key,
});

exports.dreamLookup = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {

    cors(req, res, async () => {
        const { dream, prompt } = req.query;
        const chatGPTPrompt = prompt + "\n\n" + dream;
    
        try {
            const dreamData = await interpretDream(chatGPTPrompt);
            res.status(200).json(dreamData);
        } catch (error) {
            logger.error('Error: ', error);
            res.status(500).json({ error });
        }
    });

});


async function interpretDream(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: dream}],
    })

    return chatCompletion.choices;
}