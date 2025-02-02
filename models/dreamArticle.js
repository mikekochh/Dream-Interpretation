import mongoose, { Schema, models } from "mongoose";

const dreamArticleSchema = new Schema({
    articleID: {
        type: Number,
        required: [true, "Please enter article ID!"]
    },
    articleTitle: {
        type: String,
        required: [true, "Please enter article title!"]
    },
    articleURL: {
        type: String,
        required: [true, "Please enter article URL!"]
    },
    articlePicture: {
        type: String,
        required: [true, "Please enter article picture URL!"]
    },
    prompt: {
        type: String,
        requried: [true, "Please enter the prompt for article!"]
    },
    replyTweet: {
        type: String,
        requried: [true, "Please enter reply tweet!"]
    }
})

const DreamArticle = models.DreamArticle || mongoose.model("DreamArticle", dreamArticleSchema);

export default DreamArticle;