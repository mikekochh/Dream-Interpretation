import mongoose, { Schema, models } from "mongoose";

const soundStreakSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter the user ID!"],
        unique: true
    },
    streakLength: {
        type: Number,
        required: [true, "Please enter the streak length"],
        default: 0
    },
    soundToday: {
        type: Boolean,
        required: [true, "Please enter sound for today"],
        default: false
    }
});

const SoundStreak = models.SoundStreak || mongoose.model("SoundStreak", soundStreakSchema);

export default SoundStreak;
