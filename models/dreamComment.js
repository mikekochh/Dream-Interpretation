import mongoose, { Schema, models } from "mongoose";

const dreamCommentSchema = new Schema({
    dreamID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please enter the dream ID!"]
    },
    dreamCommentContent: {
        type: String,
        required: [true, "Please enter the comment content!"]
    },
    commentDate: {
        type: Date,
        required: [true, "Please enter current date!"]
    }
});

const DreamComment = models.DreamComment || mongoose.model("DreamComment", dreamCommentSchema);

export default DreamComment;
