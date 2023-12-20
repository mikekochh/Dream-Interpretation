import mongoose, { Schema, models } from "mongoose";

const feedbackSchema = new Schema({
    feedback: {
        type: String,
        required: [true, "Please enter feedback!"]
    },
    userEmail: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    feedbackDate: {
        type: Date,
        required: [true, "Please enter character ID!"]
    },
});

const Feedback = models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default Feedback;