import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Interpretation from "../../../../../models/interpretation";
import InterpretationCounter from '../../../../../models/interpretationCounter';
import User from "../../../../../models/user";
import Dream from '../../../../../models/dream';

const isLocal = process.env.NODE_ENV === 'development';

export async function POST(req) {
    try {
        await connectMongoDB();
        // create user
        const { dreamID, interpretation , oracleID, user } = await req.json();

        console.log("Were getting here with no issues?");

        console.log("dreamID: ", dreamID);
        console.log("interpretation: ", interpretation);
        console.log("oracleID: ", oracleID);
        console.log("user: ", user);

        const interpretationDate = new Date();

        try {
            const updateDream = await Dream.findOneAndUpdate(
                { _id: dreamID },
                { $set: { interpretation: true } },
                { new: true }
            );

            console.log("Are we able to update the dream?");
            console.log("updatedDream: ", updateDream);

            if (!updateDream) {
                return NextResponse.json({message: "Dream update failed!"}, { status: 500 })
            }

            if (!user.subscribed) {
                const dreamCreditsData = await reduceDreamCredits(user._id);
            }
            console.log("Something is happening here");
            const newInterpretation = await Interpretation.create({
                dreamID,
                oracleID,
                interpretation,
                interpretationDate
            });

            console.log("newInterpretation: ", newInterpretation);

            if (!newInterpretation) {
                throw new Error('Interpretation creation failed!');
            }

            if (!isLocal) {
                const interpretationCounter = await InterpretationCounter.findByIdAndUpdate("65a58ab10d04881df7e5a2a7", { $inc: { interpretationCount: 1 } }, { new: true });
            
                if (!interpretationCounter) {
                    console.log('Interpretation counter update failed!');
                }
            }

            return NextResponse.json({message: "Interpretation saved successfully"}, { status: 200 });
        } catch (error) {
            console.log('error: ', error);
            return NextResponse.error(error);
        }
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}

async function reduceDreamCredits(_id) {
    await connectMongoDB();
    const newCredits = await User.updateOne({ _id }, { $inc: { credits: -1 } });
    return newCredits;
}