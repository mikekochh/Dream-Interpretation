import mongoose, { Schema, models } from "mongoose";

const viewsSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    view_date: {
        type: Date,
        required: [true, "View Date is required!"]
    },
    pageID: {
        type: Number,
        required: [true, "What page is the view from?!"]
    }
});

const View = models.View || mongoose.model("View", viewsSchema);

export default View;