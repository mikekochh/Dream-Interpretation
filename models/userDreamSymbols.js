import mongoose, { Schema, models } from "mongoose";

const userDreamSymbolsSchema = new Schema({
    userID: {
        type: String,
        required: [true, "User ID is required!"]
    },
    dreamID: {
        type: String,
        required: [true, "Dream ID is required!"]
    },
    symbolID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DreamSymbol",
        required: [true, "Symbol ID is required!"]
    },
    analysisDate: {
        type: Date,
        default: Date.now,
        required: [true, "Analysis date is required!"]
    }
});

const UserDreamSymbol = models.UserDreamSymbol || mongoose.model("UserDreamSymbol", userDreamSymbolsSchema);

export default UserDreamSymbol;
