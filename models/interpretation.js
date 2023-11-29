import mongoose, { Schema, models } from "mongoose";

const interpretationSchema = new Schema({
    dreamID: {
        type: Number,
        required: [true, "Please enter user ID!"]
    },
    interpretation: {
        type: String,
        required: [true, "Please enter a dream!"]
    },
    characterID: {
        type: Number,
        required: [true, "Please enter a dream interpretation!"]
    },
    interpretationDate: {
        type: Date,
        required: [true, "Please enter dream date!"]
    },
});

const Interpretation = models.Interpretation || mongoose.model("Interpretation", interpretationSchema);

export default Interpretation;