import mongoose, { Schema, models } from "mongoose";

const interpretationSchema = new Schema({
    dreamID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    interpretation: {
        type: String,
        required: [true, "Please enter a dream!"]
    },
    oracleID: {
        type: Number,
        required: [true, "Please enter a oracle ID!"]
    },
    interpretationDate: {
        type: Date,
        required: [true, "Please enter dream date!"]
    },
    liked: {
        type: Boolean
    }
});

const Interpretation = models.Interpretation || mongoose.model("Interpretation", interpretationSchema);

export default Interpretation;