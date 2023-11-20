import mongoose, { Schema, models } from "mongoose";

const activationToken = new Schema({
    userID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    tokenID: {
        type: String,
        required: [true, "Please enter token ID!"]
    },
    activatedAt: {
        type: DateTime,
    },
    createdAt: {
        type: DateTime,
    },
});

const Character = models.Character || mongoose.model("Character", characterSchema);

export default Character;