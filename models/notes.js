import mongoose, { Schema, models } from "mongoose";

const noteSchema = new Schema({
    dreamID: {
        type: String,
        required: [true, "Please enter dream ID!"]
    },
    note: {
        type: String,
    },
    lastUpdated: {
        type: Date,
        required: [true, "Please enter last updated date!"]
    },
});

const Note = models.Note || mongoose.model("Note", noteSchema);

export default Note;