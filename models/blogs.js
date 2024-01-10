import mongoose, { Schema, models } from "mongoose";

const blogSchema = new Schema({
    blogTitle: {
        type: String,
        required: [true, "Please enter blog title!"]
    },
    blogPicture: {
        type: String,
        required: [true, "Please enter blog picture!"]
    },
    blogID: {
        type: Number,
        required: [true, "Please enter blog ID!"]
    },
    likes: {
        type: Number,
        default: 0
    },
    readingTime: {
        type: Number,
        required: [true, "Please enter blog reading time in minutes!"]
    },
    description: {
        type: String,
        required: [true, "Please enter blog description!"]
    }
});

const Blog = models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;