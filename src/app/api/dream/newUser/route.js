import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Dream from '../../../../../models/dream';
import User from '../../../../../models/user';
import { SIGN_UP_TYPE_DREAM_INTERPRET, SIGN_UP_TYPE_GOOGLE } from "@/types/signUpTypes";

export async function POST(req) {
    try {
        // create user
        console.log("Is this running?");
        const { userID, dreamID, googleSignUp } = await req.json();

        await connectMongoDB();

        console.log("googleSignUp: ", googleSignUp);
        console.log("dreamID: ", dreamID);
        console.log("userID: ", userID);

        const updateDream = await Dream.findOneAndUpdate({ _id: dreamID }, { $set: { userID: userID }}, { new: true });
        
        console.log("updateDream: ", updateDream);

        if (!updateDream) {
            throw new Error("Dream not found!");
        }

        const userUpdateData = { $inc: { dreamCount: 1 } };
        if (googleSignUp) {
            userUpdateData.$set = { 
                activated: true, 
                signUpTypeID: SIGN_UP_TYPE_GOOGLE // Google sign-up
            };
        } else {
            userUpdateData.$set = {
                signUpTypeID: SIGN_UP_TYPE_DREAM_INTERPRET // Regular sign-up
            };
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { _id: userID },
            userUpdateData,
            { new: true }
        );
        

        console.log("updateUser: ", updatedUser);
        

        if (!updatedUser) {
            throw new Error("User not found!");
        }

        return NextResponse.json({message: "Local dream added to user account!"}, { status: 200 })
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({message: "Local dream was not added to user account!"}, { status: 200 })
    }
}