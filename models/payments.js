import mongoose, { Schema, models } from "mongoose";

const paymentSchema = new Schema({
    paymentTypeID: {
        type: Number,
        required: [true, "Please enter payment type id!"]
    },
    paymentTypeName: {
        type: String,
        required: [true, "Please enter a payment type name!"]
    },
    userID: {
        type: String,
        required: [true, "Please enter user ID!"]
    },
    paymentDate: {
        type: Date,
        required: [true, "Please enter payment date!"]
    },
    paymentAmount: {
        type: Number,
        required: [true, "Please enter payment amount!"]
    },
    paymentCompleted: {
        type: Boolean,
        required: [true, "Please enter payment completed status!"]
    },
    stripeSessionID: {
        type: String,
        required: [true, "Please enter stripe session ID!"]
    }, 
});

const Payment = models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;