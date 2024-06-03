import mongoose, { Schema, models } from "mongoose";

const dreamEmotionSchema = new Schema({
    emotionID: {
        type: Number,
        required: [true, "Please enter the emotion ID!"]
    },
    dreamID: {
        type: String,
        required: [true, "Please enter the dream ID!"]
    },
}, {timestamps: true});

const DreamEmotion = models.DreamEmotion || mongoose.model("DreamEmotion", dreamEmotionSchema);

export default DreamEmotion;
