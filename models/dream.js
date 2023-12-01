import mongoose, { Schema, models } from "mongoose";

const dreamSchema = new Schema({
    userID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    dream: {
        type: String,
        required: [true, "Please enter a dream!"]
    },
    interpretationID: {
        type: Number,
        required: [true, "Please enter a dream interpretation!"]
    },
    dreamDate: {
        type: Date,
        required: [true, "Please enter dream date!"]
    },
});

const Dream = models.Dream || mongoose.model("Dream", dreamSchema);

export default Dream;