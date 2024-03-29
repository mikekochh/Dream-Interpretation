import mongoose, { Schema, models } from "mongoose";

const paymentTypeSchema = new Schema({
    paymentTypeID: {
        type: Number,
        required: [true, "Please enter payment type id!"]
    },
    paymentTypeName: {
        type: String,
        required: [true, "Please enter a payment type name!"]
    },
    paymentTypePrice: {
        type: Number,
        required: [true, "Please enter a payment type price!"]
    },
    paymentTypeDescription: {
        type: String,
        required: [true, "Please enter a payment type description!"]
    },
    paymentTypePriceID: {
        type: String,
        required: [true, "Please enter a payment type price id!"]
    },
    paymentTypePriceIDTest: {
        type: String,
        required: [true, "Please enter a payment type price id for test!"]
    }
});

const PaymentType = models.PaymentType || mongoose.model("PaymentType", paymentTypeSchema);

export default PaymentType;