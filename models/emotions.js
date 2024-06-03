import mongoose, { Schema, models } from "mongoose";

const emotionSchema = new Schema({
    emotionID: {
        type: Number,
        required: [true, "Please enter the emotion ID!"],
        unique: false // Ensure this is not unique
    },
    emotionName: {
        type: String,
        required: [true, "Please enter the emotion name!"]
    },
}, {timestamps: true});

const Emotion = models.Emotion || mongoose.model("Emotion", emotionSchema);

export default Emotion;
