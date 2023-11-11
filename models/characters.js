import mongoose, { Schema, models } from "mongoose";

const characterSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter character name!"]
    },
    prompt: {
        type: String,
        required: [true, "Please enter character prompt!"]
    },
    ID: {
        type: Number,
        required: [true, "Please enter character ID!"]
    },
});

const Character = models.Character || mongoose.model("Character", characterSchema);

export default Character;