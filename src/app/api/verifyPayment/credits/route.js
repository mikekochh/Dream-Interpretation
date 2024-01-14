import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import User from "../../../../../models/user";
import Payment from '../../../../../models/payments';

const isLocalEnvironment = process.env.NODE_ENV === 'development';
const stripeSecretKey = isLocalEnvironment ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

export async function POST(req) {
    try {
        await connectMongoDB();
        // create user
        const { session_id, userEmail } = await req.json();
        try {  
            const session = await stripe.checkout.sessions.retrieve(session_id);
            if (!session) {
                throw new Error("Session not found!");
            }

            const payment = await Payment.findOne({ stripeSessionID: session_id });
            if (!payment) {
                throw new Error("Payment not found!");
            }

            if (session.payment_status === "paid" && !payment.paymentCompleted) {
                const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { $inc: { credits: payment.quantity } }, { new: true });
                if (!updatedUser) {
                    throw new Error("User not found!");
                }
                const updatedPayment = await Payment.findOneAndUpdate({ stripeSessionID: session_id }, { paymentCompleted: true }, { new: true });
            }
            else if (payment.paymentCompleted) {
                return NextResponse.json({message: "Payment already completed! Please contact support if you have not received your credits."}, { status: 500 });
            }
            else if (session.payment_status !== "paid") {
                return NextResponse.json({message: "Payment not complete! Please return to stripe screen and complete transaction, or contact support if you believe this is an error"}, { status: 500 });
            }
            return NextResponse.json({message: "User credits successfully purchased and updated!"}, { status: 200 });
        } catch (error) {
            return NextResponse.json({message: "There was an error processing your payment. Please try again or contact support if the problem persists."}, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({message: "User activation failed!"}, { status: 500 })
    }
}
