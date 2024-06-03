import mongoose, { Schema, models } from "mongoose";

const dreamStreakSchema = new Schema({
    userID: {
        type: Number,
        required: [true, "Please enter the user ID!"],
        unique: true
    },
    streakLength: {
        type: Number,
        required: [true, "Please enter the streak length"],
        default: 0
    },
    dreamedToday: {
        type: Boolean,
        required: [true, "Please enter dreamed Today"],
        default: false
    }
})

const DreamStreak = models.DreamStreak || mongoose.model("DreamStreak", dreamStreakSchema);

export default DreamStreak;
