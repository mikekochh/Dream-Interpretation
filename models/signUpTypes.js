import mongoose, { Schema, models } from "mongoose";

const signUpTypeSchema = new Schema({
    signUpTypeID: {
        type: Number,
        required: [true, "Please enter sign up type id!"]
    },
    signUpTypeName: {
        type: String,
        required: [true, "Please enter a sign up type name!"]
    },
});

const SignUpType = models.SignUpType || mongoose.model("SignUpType", signUpTypeSchema);

export default SignUpType;