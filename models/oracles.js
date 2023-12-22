import mongoose, { Schema, models } from "mongoose";

const oracleSchema = new Schema({
    oracleName: {
        type: String,
        required: [true, "Please enter oracle name!"]
    },
    oracleFullName: {
        type: String,
        required: [true, "Please enter oracle full name!"]
    },
    prompt: {
        type: String,
        required: [true, "Please enter oracle prompt!"]
    },
    oracleID: {
        type: Number,
        required: [true, "Please enter oracle ID!"]
    },
    oraclePicture: {
        type: String,
        required: [true, "Please enter oracle picture!"]
    },
    active: {
        type: Boolean,
        required: [true, "Please enter oracle active status!"]
    },
    oracleDescription: {
        type: String,
        required: [true, "Please enter oracle description!"]
    },
    selected: {
        type: Boolean,
        required: [true, "Please enter oracle selected status!"]
    }
});

const Oracle = models.Oracle || mongoose.model("Oracle", oracleSchema);

export default Oracle;