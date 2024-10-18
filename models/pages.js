import mongoose, { Schema, models } from "mongoose";

const pageSchema = new Schema({
    pageID: {
        type: Number,
        required: [true, "Please enter payment type id!"]
    },
    pageName: {
        type: String,
        required: [true, "Please enter a payment type name!"]
    },
});

const Page = models.Page || mongoose.model("Page", pageSchema);

export default Page;