import mongoose, { Schema, models } from "mongoose";

const genderSchema = new Schema({
    genderID: {
        type: Number,
        required: [true, "Please enter the gender ID!"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "Please enter the gender name!"]
    },
}, {timestamps: true});

const Gender = models.Gender || mongoose.model("Gender", genderSchema);

export default Gender;
