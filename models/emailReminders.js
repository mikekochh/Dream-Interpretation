import mongoose, { Schema, models } from "mongoose";

const emailReminderSchema = new Schema({
    email: {
        type: String,
        required: [true, "Please enter the user ID!"]
    },
    reminderDate: {
        type: Date,
        required: [true, "Please enter a date for reminder to be sent!"]
    },
    emailSent: {
        type: Boolean,
        required: [true, "Please enter if reminder has been sent or not!"],
        default: false
    }
});

const EmailReminder = models.EmailReminder || mongoose.model("EmailReminder", emailReminderSchema);

export default EmailReminder;