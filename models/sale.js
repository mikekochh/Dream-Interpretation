import mongoose, { Schema, models } from "mongoose";

const saleSchema = new Schema({
    isSale: {
        type: Boolean,
        required: [true, "Please enter if there is a sale!"]
    },
    saleDescriptionDesktop: {
        type: String,
        required: [true, "Please enter sale description for desktop!"]
    },
    saleDescriptionMobile: {
        type: String,
        required: [true, "Please enter sale description for mobile!"]
    },
    couponID: {
        type: String,
        required: [true, "Please enter coupond ID!"]
    },
    couponIDTest: {
        type: String,
        required: [true, "Please enter coupond ID for test!"]
    },
    telegramText: {
        type: String,
        required: [true, "Please enter telegram text!"]
    },
    creditText: {
        type: String,
        required: [true, "Please enter credit text!"]
    },
    subscriptionText: {
        type: String,
        required: [true, "Please enter subscription text!"]
    },
    bannerMessage: {
        type: String,
        required: [true, "Please enter banner message!"]
    },
});

const Sale = models.Sale || mongoose.model("Sale", saleSchema);

export default Sale;