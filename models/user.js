import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        unique: true
    },
    password: {
        type: String,
        required: [false, "Please enter your password!"]
    },
    credits: {
        type: Number,
    },
    characterID: {
        type: Number,
    },
    activated: {
        type: Boolean,
    },
    verificationTokenID: {
        type: String,
    },
    subscribed: {
        type: Boolean,
    },
    subscriptionID: {
        type: String,
    },
    metaAnalysisOracleID: {
        type: Number,
    },
    communityAccess: {
        type: Boolean,
    },
    dreamCount: {
        type: Number,
        default: 0,
    },
    genderID: {
        type: Number,
    },
    culturalBackground: {
        type: String,
    },
    spiritualPractices: {
        type: String,
    },
    age: {
        type: Number,
    },
    birthdate: {
        type: Date
    }
}, {timestamps: true});

const User = models?.User || mongoose.model("User", userSchema);

export default User;
