const admin = require('firebase-admin');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');
const OpenAI = require('openai');
const cors = require('cors')({ origin: true });
const { MongoClient } = require('mongodb');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const { ObjectId } = require('mongodb'); 
const path = require('path');
const { Storage } = require('@google-cloud/storage');

// Set SendGrid API key
sgMail.setApiKey(functions.config().sendgrid.api_key);

// Initialize Firebase Admin SDK
admin.initializeApp();

const openai = new OpenAI({
    apiKey: functions.config().openai.api_key,
});

const uri = functions.config().mongodb.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// OpenAI API setup using the existing configuration
const OPENAI_API_KEY = functions.config().openai.api_key;
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations'; // Use this constant for the API URL

const storage = new Storage();

exports.dreamLookupWithQuestions = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { dreamID, oracleID, questions, answers } = req.query;

        try {
            await client.connect();
            const db = client.db('dreamsite');

            const dreams = db.collection('dreams');
            const oracles = db.collection('oracles');
            const interpretations = db.collection('interpretations');
            const interpretationCounter = db.collection('interpretationcounters');
            logger.info('dreamID: ', dreamID);
            logger.info("oracleID: ", oracleID);
            logger.info("oracleID type of: ", typeof oracleID);
            logger.info("questions: ", questions);
            logger.info("answers: ", answers);

            const dreamDBData = await dreams.findOne({ _id: new ObjectId(dreamID) });
            const dreamText = dreamDBData?.dream;

            if (!dreamText) {
                throw new Error("Dream not found");
            }

            console.log("dreamText: ", dreamText);

            const oracleData = await oracles.findOne({ oracleID: Number(oracleID) });

            console.log("oracleData: ", oracleData);
            const oraclePrompt = oracleData?.newPrompt;

            if (!oraclePrompt) {
                throw new Error("Oracle prompt not found");
            }

            console.log("oraclePrompt: ", oraclePrompt);

            // Combine the dream prompt with questions and answers
            let fullPrompt = oraclePrompt + '\n\nDream:\n' + dreamText + '\n\nQuestions and Answers:\n';

            // Append each question and answer to the prompt
            questions.forEach((question, index) => {
                fullPrompt += `\nQ${index + 1}: ${question}\nA${index + 1}: ${answers[index] || "No answer provided"}\n`;
            });

            logger.info('fullPrompt: ', fullPrompt);

            // Send the fullPrompt to ChatGPT
            const dreamData = await interactWithChatGPT(fullPrompt);

            logger.info('dreamData: ', dreamData);
            logger.info("the interpretation: ", dreamData[0].message.content);

            if (dreamID && oracleID) {
                const organizeInterpretationPrompt = `Take the following dream interpretation and organize it into well-structured HTML code. The HTML should contain sections with titles, each section should have a heading (<h2>) and the corresponding content in paragraphs (<p>). The final section should be a summary of the interpretation. Ensure the HTML is valid and easy to display on a webpage. Return only the HTML code and nothing else.

                Dream interpretation: ${dreamData[0].message.content}
               
                Output format:
                <h2>Section 1 Title</h2>
                <p>Details for section 1.</p>

                <h2>Section 2 Title</h2>
                <p>Details for section 2.</p>

                <h2>Summary</h2>
                <p>Summary of the interpretation.</p>`;

                const organizedInterpretationData = await interactWithChatGPT(organizeInterpretationPrompt);
                logger.info("organized dream interpretation: ", organizedInterpretationData);
                

                const newInterpretation = await interpretations.insertOne({
                    dreamID,
                    oracleID,
                    interpretation: organizedInterpretationData[0].message.content,
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
            const dreamData = await interactWithChatGPT(dreamPrompt);
            logger.info('dreamData: ', dreamData);
            logger.info("the interpretation: ", dreamData[0].message.content);

            if (dreamID && oracleID) {
                const organizeInterpretationPrompt = `Take the following dream interpretation and organize it into well-structured HTML code. The HTML should contain sections with titles, each section should have a heading (<h2>) and the corresponding content in paragraphs (<p>). The final section should be a summary of the interpretation. Ensure the HTML is valid and easy to display on a webpage. Return only the HTML code and nothing else.

                Dream interpretation: ${dreamData[0].message.content}
               
                Output format:
                <h2>Section 1 Title</h2>
                <p>Details for section 1.</p>

                <h2>Section 2 Title</h2>
                <p>Details for section 2.</p>

                <h2>Summary</h2>
                <p>Summary of the interpretation.</p>`;

                const organizedInterpretationData = await interactWithChatGPT(organizeInterpretationPrompt);
                logger.info("organized dream interpretation: ", organizedInterpretationData);
                

                const newInterpretation = await interpretations.insertOne({
                    dreamID,
                    oracleID,
                    interpretation: organizedInterpretationData[0].message.content,
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

exports.dreamSymbols = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { dreamText, dreamID, userID } = req.query;

        try {
            await client.connect();
            const db = client.db('dreamsite');
            const symbolsCollection = db.collection('dreamsymbols');
            const userDreamSymbolsCollection = db.collection('userdreamsymbols'); // Collection to store dreamID, symbolID, and optionally userID
            logger.info('dreamText: ', dreamText);
            logger.info('dreamID: ', dreamID);
            logger.info('userID: ', userID);

            // Check if dreamID is provided (userID is now optional)
            if (!dreamID) {
                throw new Error('dreamID is required.');
            }

            // Fetch the master list of symbols from the dreamsymbols collection
            const symbolsList = await symbolsCollection.find({}).toArray();

            // Split the symbols into chunks of 100 symbols
            const chunkSize = 75;
            const symbolChunks = [];
            for (let i = 0; i < symbolsList.length; i += chunkSize) {
                symbolChunks.push(symbolsList.slice(i, i + chunkSize));
            }

            let allMatchedSymbols = new Set(); // Use a Set to collect unique symbols

            // Iterate through the symbol chunks and send them to ChatGPT in separate requests
            for (const chunk of symbolChunks) {
                const symbolTerms = chunk.map(symbolObj => symbolObj.symbol.toLowerCase()).join(', ');

                // Generate a prompt that asks ChatGPT to find matching symbols from the symbol list in the dream, without forcing symbols that don't exist
                const symbolsPrompt = `Analyze the following dream and return any symbols from the provided list that are present in the dream. Only return symbols exactly as they are written in the list, without altering the capitalization, punctuation, or wording. If no symbols from the list are found in the dream, return nothing. The symbols are: ${symbolTerms}.
                                
                Dream: ${dreamText}
                                
                Output format (return symbols exactly as they appear in the list, or return nothing if no symbols are found):
                Symbol1
                Symbol2
                Symbol3`;

                // Use ChatGPT to extract matching symbols for the current chunk
                const dreamData = await interactWithChatGPT(symbolsPrompt);
                logger.info('dreamData: ', dreamData);

                // Extract the symbols matched in the dream from the current chunk
                const matchedSymbols = dreamData[0].message.content.split('\n').filter(symbol => symbol.trim() !== '');
                logger.info("Matched Symbols in this chunk: ", matchedSymbols);

                // Add the matched symbols to the Set to ensure uniqueness
                matchedSymbols.forEach(symbol => allMatchedSymbols.add(symbol.trim()));
            }

            logger.info("All matched symbols (unique): ", Array.from(allMatchedSymbols));

            // Iterate over the unique matched symbols and insert into userdreamsymbols collection
            for (const symbol of allMatchedSymbols) {
                // Find the corresponding symbol ID from the dreamsymbols collection
                const symbolEntry = await symbolsCollection.findOne({ symbol: { $regex: new RegExp(`^${symbol.trim()}$`, 'i') } });

                if (symbolEntry) {
                    // Check if the symbol already exists for this dream (without requiring a userID)
                    const existingEntry = await userDreamSymbolsCollection.findOne({
                        dreamID,
                        symbolID: symbolEntry._id,
                        ...(userID && { userID }) // Add userID to the query only if it's provided
                    });

                    // Only insert if the symbol does not already exist for this dream
                    if (!existingEntry) {
                        const newUserSymbolEntry = await userDreamSymbolsCollection.insertOne({
                            dreamID,
                            symbolID: symbolEntry._id,
                            analysisDate: new Date(),
                            ...(userID && { userID }) // Save userID only if provided
                        });

                        logger.info("New user symbol entry: ", newUserSymbolEntry);
                    } else {
                        logger.info("Duplicate symbol entry skipped: ", symbolEntry.symbol);
                    }
                }
            }

            res.status(200).json({ success: true, matchedSymbols: Array.from(allMatchedSymbols) });
        } catch (error) {
            logger.error('Error: ', error);
            res.status(500).json({ error: error.message });
        }
    });
});

exports.generateDreamImage = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { dream, dreamID } = req.body;

            if (!dream || !dreamID) {
                console.error("Missing dream or dreamID in request");
                return res.status(400).json({ message: 'dream and dreamID are required!' });
            }

            // Connect to MongoDB
            try {
                await client.connect();
                console.log("Connected to MongoDB successfully");

                const db = client.db('dreamsite');
                const dreamsCollection = db.collection('dreams');
    
                // Generate the prompt for OpenAI API
                const prompt = `A beautiful and dreamlike scene based on the following dream: ${dream}`;
    
                // Request to OpenAI API
                let imageResponse;
                try {
                    imageResponse = await axios.post(
                        OPENAI_API_URL,
                        {
                            prompt: prompt,
                            n: 1,
                            size: "1024x1024",
                            model: "dall-e-3",
                            response_format: "url"
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                } catch (error) {
                    console.error("OpenAI API error: ", error.message);
                    return res.status(500).json({ message: 'Error generating image from OpenAI' });
                }
    
                if (imageResponse.data && imageResponse.data.data && imageResponse.data.data.length > 0) {
                    const imageURL = imageResponse.data.data[0].url;
    
                    // Download image
                    const imagePath = path.resolve(`/tmp`, `${dreamID}.png`); // Use temp storage for Firebase functions
                    const imageDownloadResponse = await axios({
                        url: imageURL,
                        method: 'GET',
                        responseType: 'stream',
                    });
    
                    // Save the image to Firebase Storage (or use your preferred storage)
                    const bucketName = 'dream-oracles.appspot.com';
                    const bucket = storage.bucket(bucketName);
                    const file = bucket.file(`${dreamID}.png`);
                    const writeStream = file.createWriteStream();
    
                    imageDownloadResponse.data.pipe(writeStream);
    
                    writeStream.on('finish', async () => {
                        console.log('Image successfully uploaded to Firebase Storage');
                        const publicUrl = `https://storage.googleapis.com/${bucketName}/${dreamID}.png`;
                        console.log("publicURL: ", publicUrl);
    
                        // Update MongoDB with the image URL
                        try {
                            const newDream = await dreamsCollection.findOneAndUpdate(
                                { _id: new ObjectId(dreamID) },
                                { $set: { imageURL: publicUrl } },
                                { returnOriginal: false }
                            );
                            console.log("the newDream: ", newDream);
                        } catch (error) {
                            console.error("MongoDB update error: ", error.message);
                            return res.status(500).json({ message: 'Error updating dream with image URL' });
                        }
    
                        return res.status(200).json({ message: 'Image generated and saved successfully', imageURL: publicUrl });
                    });
    
                    writeStream.on('error', (err) => {
                        console.error("Error saving image to storage:", err);
                        return res.status(500).json({ message: 'Error saving image to storage' });
                    });
                } else {
                    console.error("Image generation failed!");
                    return res.status(500).json({ message: 'Image generation failed!' });
                }
            } catch (error) {
                console.error("MongoDB connection error: ", error.message);
                return res.status(500).json({ message: "Error connecting to MongoDB" });
            }
        } catch (error) {
            console.error("Unexpected error: ", error.message);
            return res.status(500).json({ message: 'Error processing request!' });
        }
    });
});

exports.dreamSummary = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const { dream } = req.query;
        logger.info('the dream: ', dream);
        try {
            const dreamSummaryPrompt = "Here is a dream entry. Please describe the most visually significant scene in no more than 50 words. Focus on vivid imagery, avoiding inappropriate, sensitive details, and any references to famous people. The description should evoke imagination for a creative image generation. Here is the dream:\n\n" + dream;

            const summarizedDream = await interactWithChatGPT(dreamSummaryPrompt);
            logger.info('summary data: ', summarizedDream);
            logger.info('the summary: ', summarizedDream[0].message.content);

            res.status(200).json(summarizedDream);
        } catch (error) {
            logger.error('Error summarizing dream: ', error);
            res.status(500).json({ error: error.message });
        }
    })
})

exports.dreamQuestions = functions.runWith({ maxInstances: 10, timeoutSeconds: 180 }).https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { dream, oracleID } = req.query;
            logger.info('the dream we are questioning: ', dream);
            logger.info('the oracle we are using: ', oracleID);

            await client.connect();
            const db = client.db('dreamsite');
            const oracles = db.collection('oracles');

            const selectedOracleData = await oracles.findOne({ oracleID: Number(oracleID) });

            console.log("selectedOracleData: ", selectedOracleData);

            const fullPrompt = selectedOracleData.questionPrompt + "\n\n" + dream;
    
            const questionDreamData = await interactWithChatGPT(fullPrompt);
            logger.info('the questions data: ', questionDreamData);
            const questionDreamRaw = questionDreamData[0].message.content;
            logger.info('the questions raw data: ', questionDreamRaw);
    
            const secondPrompt = "Take the following string that contains multiple questions and organize each question as a separate entry in a JSON array. The output should be only the clean JSON array, with each question as a string element in the array. Here is the input:\n\n" + questionDreamRaw;
            console.log("secondPrompt: ", secondPrompt);
    
            const questionDreamJson = await interactWithChatGPT(secondPrompt);
            console.log("questionDreamJson: ", questionDreamJson);

            let questionFinalData = questionDreamJson[0].message.content;
            console.log("questionFinalData: ", questionFinalData);

            // Use regex to extract only the JSON part if there is extra text
            const jsonMatch = questionFinalData.match(/\[.*\]/s);
            if (jsonMatch) {
                questionFinalData = jsonMatch[0]; // Extract JSON array content
            }

            // Parse as JSON
            const questionArray = JSON.parse(questionFinalData);
            res.status(200).json(questionArray);
        } catch (error) {
            logger.error('Error generating questions for dream: ', error);
            res.status(500).json({ error: error.message });
        }
    });
});


// Scheduled function to run every night at midnight for dream streaks and soul sound streaks
exports.scheduledFunction = functions.pubsub.schedule('every day 00:00').onRun(async (context) => {
    logger.info('Scheduled function running at midnight');
    await client.connect();
    const db = client.db('dreamsite');
    const collectionDreamStreaks = db.collection('dreamstreaks');
    const collectionSoundStreaks = db.collection('soundstreaks');

    try {
        // first, handle dream streaks
        const updateFalseResult = await collectionDreamStreaks.updateMany(
            { dreamedToday: false },
            { $set: { streakLength: 0 } }
        );
        logger.info('Updated documents where dreamedToday was false', updateFalseResult);

        const updateTrueResult = await collectionDreamStreaks.updateMany(
            { dreamedToday: true },
            { $set: { dreamedToday: false } }
        );
        logger.info('Updated documents where dreamedToday was true', updateTrueResult);

        // second, handle sound streaks
        const updateFalseResultSound = await collectionSoundStreaks.updateMany(
            { soundToday: false },
            { $set: { streakLength: 0 } }
        );
        logger.info('Updated documents where soundToday was false', updateFalseResultSound);

        const updateTrueResultSound = await collectionSoundStreaks.updateMany(
            { soundToday: true },
            { $set: { soundToday: false } }
        )
        logger.info('Updated documents where soundToday was true', updateTrueResultSound);

    } catch (error) {
        logger.error('Error updating streaks: ', error);
    } finally {
        return null;
    }
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
                
                // Calculate start of the previous week
                const startOfPreviousWeek = new Date(today);
                startOfPreviousWeek.setDate(today.getDate() - dayOfWeek - 7);
                startOfPreviousWeek.setHours(0, 0, 0, 0);
                
                // Calculate end of the previous week
                const endOfPreviousWeek = new Date(startOfPreviousWeek);
                endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 7);

                logger.info("Start Date Created: ", startOfPreviousWeek);
                logger.info("End Date Created: ", endOfPreviousWeek);

                const userWeeklyDreams = await dreamsCollection.find({ userID: user._id.toString(), dreamDate: { $gte: startOfPreviousWeek, $lt: endOfPreviousWeek } }).toArray();
                
                if (!userWeeklyDreams) {
                    logger.error(`Failed to fetch dreams for user: ${user._id}`);
                } else {
                    logger.info(`Retrieved ${userWeeklyDreams.length} dreams for user: ${user._id}`);
                }

                let dreamsOfTheWeek = [];

                userWeeklyDreams.forEach(dream => {
                    dreamsOfTheWeek.push("```\n" + dream.dream);
                });

                let fullMetaAnalysisPrompt = oracle.oracleMetaAnalysisPrompt + "\n" +
                    "Do not introduce yourself, just get straight into the meta-analysis. At the end of the meta analysis, write a summary and overarching theme section, which is one section. Begin each paragraph with a title, and each title, and only the titles, should be listed like this:" + "\n" +
                    "**The Title**" + "\n" + "Do not bold anything else but the titles. Here are the dreams:" + "\n\n" + dreamsOfTheWeek.join("\n\n");
                

                logger.info('This is the full meta analysis prompt being used: ', fullMetaAnalysisPrompt);

                const resMetaAnalysis = await interactWithChatGPT(organizeInterpretationPrompt);

                const metaAnalysis = resMetaAnalysis.data[0].message.content;

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
    }
});

// Scheduled function to send email reminders every day at 5 AM Eastern Standard Time
exports.sendEmailReminders = functions.pubsub
  .schedule('every day 05:00')
  .timeZone('America/New_York') // Time zone set to New York Eastern Standard Time
  .onRun(async (context) => {
    logger.info('sendEmailReminders function running at 5 AM Eastern Standard Time');

    try {
      await client.connect();
      const db = client.db('dreamsite');
      const usersCollection = db.collection('users');

      // Find users where sendReminder is true
      const usersToRemind = await usersCollection
        .find({
          sendReminder: true,
        })
        .toArray();

      logger.info(`Found ${usersToRemind.length} users to send reminders`);

      for (const user of usersToRemind) {
        const email = user.email;
        const fromAddress = 'noreply@dreamoracles.co';
        const domain = 'https://www.dreamoracles.co';

        // Construct the email content using the email template
        const mailOptions = {
          from: `Dream Oracles <${fromAddress}>`,
          to: email,
          subject: 'Dream Reminder',
          html: `
          <html>
              <body>
                  <div style="width: 100%; display: flex; justify-content: center; background-color: #f0f0f0; padding: 20px; box-sizing: border-box;">
                      <table style="width: 100%; margin: auto; background-color: #ffffff; border-radius: 10px; color: #000000; box-sizing: border-box; overflow: hidden;">
                          <tr>
                              <td style="background-color: #003366; padding: 0; color: #ffffff; font-size: 24px; max-height: 500px; position: relative; overflow: hidden;">
                                  <a href="${domain}" style="display: block; text-decoration: none;">
                                      <div style="position: absolute; top: 20px; left: 20px;">
                                          <div style="display: flex; align-items: center;">
                                              <img src="${domain}/dream_icon.webp" alt="Dream Oracles Logo" style="max-width: 40px; height: 40px; border-radius: 25%; margin-right: 10px; margin-left: 10px; margin-top: 10px;">
                                              <span style="font-size: 18px; color: #ffffff !important; line-height: 55px;">Dream Oracles</span>
                                          </div>
                                      </div>
                                      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 40px; font-weight: bold; text-align: center; color: #ffffff;">
                                          Dream Reminder
                                      </div>
                                  </a>
                              </td>
                          </tr>
                          <tr>
                              <td valign="top" style="text-align: left; color: #000000; padding: 20px; overflow: auto;">
                                  <h1 style="color: #000000;">Good Morning!</h1>
                                  <p style="color: black;">Did you have a curious dream last night and wonder what it could mean?</p>
                                  <p style="color: black;">We're here to help you explore the insights hidden within your dreams.</p>
                                  <p style="color: black;">Click the link below to enter your dream into our interpretation software and uncover its meaning:</p>
                                  <h3 style="text-align: center;"><a href="${domain}/interpret" style="color: blue; text-decoration: underline;">Enter Your Dream</a></h3>
                                  <p style="color: black;">Wishing you a day filled with wonder and discovery!</p>
                                  <p style="color: black;">Warm regards,<br/>The Dream Oracles Team</p>
                              </td>
                          </tr>
                      </table>
                  </div>
              </body>
          </html>
          `,
        };

        // Send the email using SendGrid
        try {
          await sgMail.send(mailOptions);
          logger.info(`Email sent to ${email}`);

          // Update the user's sendReminder field to false
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { sendReminder: false } }
          );
          logger.info(`Updated sendReminder to false for user ${user._id}`);
        } catch (error) {
          logger.error(`Error sending email to ${email}: `, error);
        }
      }
    } catch (error) {
      logger.error('Error in sendEmailReminders function: ', error);
    } finally {
      await client.close();
    }
});

async function interactWithChatGPT(dream) {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: dream }],
    });
    logger.info('chatCompletion: ', chatCompletion);

    return chatCompletion.choices;
}

function formatMetaAnalysisText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<h2 style="margin-bottom: 5px;">$1</h2>') // Replace **text** with <h3>text</h3> and set margin-bottom to reduce space
        .replace(/\n\n/g, '<br>') // Replace double newlines with <br> for paragraphs
        .replace(/\n/g, ''); // Remove remaining single newlines
}