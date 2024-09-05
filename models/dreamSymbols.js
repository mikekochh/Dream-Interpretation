import mongoose, { Schema, models } from "mongoose";

const dreamSymbolSchema = new Schema({
    symbol: {
        type: String,
        required: [true, "Symbol is required!"]
    },
    meaning: {
        type: String,
        required: [true, "Meaning is required!"]
    },
});

const DreamSymbol = models.DreamSymbol || mongoose.model("DreamSymbol", dreamSymbolSchema);

export default DreamSymbol;
