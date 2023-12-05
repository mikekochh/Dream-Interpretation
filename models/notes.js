import mongoose, { Schema, models } from "mongoose";

const noteSchema = new Schema({
    dreamID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    note: {
        type: String,
        required: [true, "Please enter a dream!"]
    },
    lastUpdated: {
        type: Date,
        required: [true, "Please enter dream date!"]
    },
});

const Note = models.Note || mongoose.model("Note", noteSchema);

export default Note;