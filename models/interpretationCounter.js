import mongoose, { Schema, models } from "mongoose";

const interpretationCounterSchema = new Schema({
    interpretationCount: {
        type: Number,
        required: [true, "Please enter interpretation count!"]
    },
});

const InterpretationCounter = models.InterpretationCounter || mongoose.model("InterpretationCounter", interpretationCounterSchema);

export default InterpretationCounter;