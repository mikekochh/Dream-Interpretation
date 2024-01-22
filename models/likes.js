import mongoose, { Schema, models } from "mongoose";

const likeSchema = new Schema({
    giverID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    dreamID: {
        type: String,
        required: [true, "Please enter dream ID!"]
    },
    receiverID: { 
        type: String,
        required: [true, "Please enter user ID!"]
    },
});

const Like = models.Like || mongoose.model("Like", likeSchema);

export default Like;