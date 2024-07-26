import mongoose, { Schema, models } from "mongoose";

const metaAnalysisSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter a user ID!"]
    },
    metaAnalysis: {
        type: String,
        required: [true, "Please enter a meta analysis!"]
    },
    oracleID: {
        type: Number,
        required: [true, "PLease enter a oracle ID!"]
    },
    metaAnalysisDate: {
        type: Date,
        required: [true, "Please enter a meta analysis date!"]
    }
});

const MetaAnalysis = models.MetaAnalysis || mongoose.model("MetaAnalysis", metaAnalysisSchema);

export default MetaAnalysis;