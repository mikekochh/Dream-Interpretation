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
        required: [true, "Please enter your password!"]
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

}, {timestamps: true});

const User = models.User || mongoose.model("User", userSchema);

export default User;