import mongoose, { Schema, models } from "mongoose";

const dreamSchema = new Schema({
    userID: {
        type: String,
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
    interpretation: {
        type: Boolean,
        default: false,
        required: [true, "Is dream being interpreted?!"]
    },
    starred: {
        type: Boolean,
        default: false,
        required: [true, "Is dream starred?!"]    
    },
    imageURL: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    }
});

const Dream = models.Dream || mongoose.model("Dream", dreamSchema);

export default Dream;