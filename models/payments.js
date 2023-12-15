import mongoose, { Schema, models } from "mongoose";

const paymentSchema = new Schema({
    paymentID: {
        type: Number,
        required: [true, "Please enter payment ID!"]
    },
    paymentPrice: {
        type: Number,
        required: [true, "Please enter a payment price!"]
    },
    paymentName: {
        type: String,
        required: [true, "Please enter payment name!"]
    },
    paymentType: {
        type: String,
        required: [true, "Please enter payment type!"]
    },
});

const Payment = models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;