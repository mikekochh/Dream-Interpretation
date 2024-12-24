import mongoose, { Schema, models } from "mongoose";

const symbolsSchema = new Schema({
    symbol: {
        type: String,
        required: [true, "Symbol is required!"]
    },
    short_meaning: {
        type: String,
        required: [true, "Short Meaning is required!"]
    },
    detailed_meaning: {
        type: String,
        required: [true, "Detailed Meaning is required!"]
    },
    symbolsCount: {
        type: Number,
        default: 0
    }
});

const Symbol = models.Symbol || mongoose.model("Symbol", symbolsSchema);

export default Symbol;