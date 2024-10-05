import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import EmailReminder from "../../../../../models/emailReminders";

export async function POST(req) {
    try {
        const { email } = await req.json();

        await connectMongoDB();

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const newEmailReminder = new EmailReminder({
            email: email,
            reminderDate: yesterday,
            emailSent: false, // Ensure this field is set if it's required
        });

        await newEmailReminder.save();

        return NextResponse.json({ message: "User Email Reminder set!" }, { status: 200 });
    } catch (error) {
        console.log('error: ', error);
        return NextResponse.json({ message: "User email reminder update failed!" }, { status: 500 });
    }
}
